export function handleErrorBoundaryBlockError(error: Error) {
    throw error; // For Pages router, when there is an error in a block, it should just fail (build fails)
}
