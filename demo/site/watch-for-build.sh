#!/bin/bash -e

update_build () {
	echo "Cleaning old update dirs..."
	rm -rf build/new-current/* build/old-current/*
	mkdir -p build/new-current

	DESIRED_VERSION=$1

	if [ -z $DESIRED_VERSION ]; then
		echo "DEBUG: No update param given; setting to last available version"
		DESIRED_VERSION=$(ls -t /mnt/generated-sites/ | head -1)

		if [ -z $DESIRED_VERSION ]; then
			echo "No build available --> skipping update"
			return;
		fi
	fi

	echo "Updating to $DESIRED_VERSION..."
	tar -xf /mnt/generated-sites/$DESIRED_VERSION --force-local -C build/new-current

	echo "Backing up current version..."
	mv build/current/ build/old-current/
	echo "Updating to new version..."
	mv build/new-current/ build/current
	echo "File update finished successfully..."

	echo "Updating current version file..."
	echo $DESIRED_VERSION > ./CURRENT_VERSION
	echo "Version file successfully updated - UPDATE FINISHED!"

	echo "Deleting Archive..."
	rm -f $(ls -1dt /mnt/generated-sites/* | tail -n +3)

	echo "Killing existing next server..."
	curl --fail localhost:3001/restart
}

while true
do
	echo "Checking for a new build..."

	CURRENT_VERSION_FILE=./CURRENT_VERSION
	if [ -f $CURRENT_VERSION_FILE ]; then
		echo "$CURRENT_VERSION_FILE exists, checking the version"

		if [[ -s $CURRENT_VERSION_FILE ]]; then
			CURRENT_VERSION=$(cat $CURRENT_VERSION_FILE)
			echo "INFO: current version is $CURRENT_VERSION"
			LATEST_BUILD=$(ls -t /mnt/generated-sites/ | head -1)
			echo "INFO: latest available version is $LATEST_BUILD"

			if [ "$LATEST_BUILD" \> "$CURRENT_VERSION" ]; then
				echo "new build available, starting to update..."
				update_build $LATEST_BUILD
			else
				echo "INFO: current version is up to date"
			fi
		else
			echo "$CURRENT_VERSION_FILE is empty, updating build"
			update_build
		fi
	else
		echo "$CURRENT_VERSION_FILE does not exist, updating build..."
		update_build
	fi

	sleep 5
done
