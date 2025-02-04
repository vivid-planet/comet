---
title: Create fixtures
---

To insert some data into the database, we will use fixtures. Fixtures are a way to insert data into the database. The fixtures are defined in the `db/fixtures/generators` directory in the `api` directory. To generate fixtures, it's often useful to generate a lot of data.[@faker-js/faker](https://github.com/faker-js/faker) is often a good choice for generating a lot of random data.

## Create Fixtures

Create a new file in the `fixtures` directory with the following content:

```
customer-fixtures.service.ts
```
```typescript
import { faker } from "@faker-js/faker";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Customer } from "@src/customer/entities/customer.entity";
import { mapLimit } from "async";
import { SingleBar } from "cli-progress";

interface GenerateCustomerOptions {
    repository: EntityRepository<Customer>;
    bar: SingleBar;
    total: number;
}

export const generateCustomers = async ({ repository, bar, total }: GenerateCustomerOptions): Promise<Customer[]> => {
    const generateRandomCustomer = async (): Promise<Customer> => {
        const customer = repository.create({
            id: faker.string.uuid(),
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
        });

        bar.increment(1, {
            title: "Customer",
        });

        return customer;
    };

    return mapLimit<number, Customer>(Array(total), 100, async () => generateRandomCustomer());
};
```

The `generateCustomers` functions is a convenience function, that receives some options, like the repository, a progress bar and the total number of customers to generate. The function then generates the customers and increments the progress bar.

## Add Fixtures to the FixturesConsole
Additionally, the created fixtures (`generateCustomer`) must be called and executed. Open `db/fixtures/generators/fixtures.console.ts` an add the fixtures functions calls so the function gets execute when fixtures get created:

```typescript
export class FixturesConsole {
    //....
    async execute(total?: string | number): Promise<void> {
        //...

        const multiBar = new MultiBar(this.barOptions, Presets.shades_classic);

        // Add your fixtures here
        await Promise.all([generateCustomers({
            repository: this.orm.em.getRepository(Customer),
            bar: multiBar.create(total, 0),
            total
        })]);

        multiBar.stop();
        // ...

        await this.orm.em.flush();
    }
}
```

## Execute Fixtures

Everything should be set up now. To execute the fixtures, run the following command:

```bash
npm run --prefix api fixtures
```

## Verify Fixtures 

Now we are ready to execute the Query again in the GraphQL Playground, and one should see that the Query is executed successfully and will return the generated Data

![Fixtures](./images/customerQueryInPlaygroundWithFixtureData.png)