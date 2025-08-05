import { type ArgumentsHost, BadRequestException, HttpException, InternalServerErrorException } from "@nestjs/common";

import { CometEntityNotFoundException } from "./entity-not-found.exception";
import { ExceptionFilter } from "./exception.filter";
import { CometValidationException } from "./validation.exception";
import Mock = jest.Mock;

const graphQLHost = {
    getType: () => "graphql",
} as ArgumentsHost;

jest.spyOn(console, "error").mockImplementation(() => {
    // noop
});

describe("ExceptionFilter", () => {
    describe("catch", () => {
        describe("graphql", () => {
            it("returns BadRequestException for CometException", () => {
                const exceptionFilter = new ExceptionFilter(false);

                const returnError = exceptionFilter.catch(new CometEntityNotFoundException("Not found"), graphQLHost);

                expect(returnError).toBeInstanceOf(BadRequestException);
                expect((returnError as BadRequestException).getResponse()).toEqual({
                    statusCode: 400,
                    message: "Not found",
                    error: "CometEntityNotFoundException",
                    validationErrors: [],
                });
            });

            it("returns BadRequestException for CometValidationException", () => {
                const exceptionFilter = new ExceptionFilter(false);

                const returnError = exceptionFilter.catch(new CometValidationException("Invalid", [{ property: "prop1" }]), graphQLHost);

                expect(returnError).toBeInstanceOf(BadRequestException);
                expect((returnError as BadRequestException).getResponse()).toEqual({
                    statusCode: 400,
                    message: "Invalid",
                    error: "CometValidationException",
                    validationErrors: [
                        {
                            property: "prop1",
                        },
                    ],
                });
            });

            it("returns HttpException for HttpException", () => {
                const exceptionFilter = new ExceptionFilter(false);

                const returnError = exceptionFilter.catch(new HttpException("Unauthorized", 401), graphQLHost);

                expect(returnError).toBeInstanceOf(HttpException);
                expect((returnError as HttpException).getResponse()).toBe("Unauthorized");
            });

            it("returns InternalServerErrorException for normal Error in non-debug mode", () => {
                const exceptionFilter = new ExceptionFilter(false);

                const returnError = exceptionFilter.catch(new Error("Other error"), graphQLHost);

                expect(returnError).toBeInstanceOf(InternalServerErrorException);
                expect((returnError as InternalServerErrorException).getResponse()).toEqual({
                    message: "Internal Server Error",
                    statusCode: 500,
                });
            });

            it("returns real Error for normal Error in debug mode", () => {
                const exceptionFilter = new ExceptionFilter(true);

                const returnError = exceptionFilter.catch(new Error("Other error"), graphQLHost);

                expect(returnError).toBeInstanceOf(Error);
                expect((returnError as Error).message).toBe("Other error");
            });
        });

        describe("http", () => {
            let httpHost: ArgumentsHost;
            let statusMock: Mock;
            let jsonMock: Mock;

            beforeEach(() => {
                statusMock = jest.fn();
                jsonMock = jest.fn();

                httpHost = {
                    getType: () => "http",
                    switchToHttp: jest.fn(() => ({
                        getResponse: jest.fn(() => ({
                            status: statusMock.mockReturnThis(),
                            json: jsonMock,
                        })),
                    })),
                } as unknown as ArgumentsHost;
            });

            it("response status is 400 and json is correct for CometException", () => {
                const exceptionFilter = new ExceptionFilter(false);

                exceptionFilter.catch(new CometEntityNotFoundException("Not found"), httpHost);

                const responseMock = httpHost.switchToHttp().getResponse();
                expect(responseMock.status).toHaveBeenCalledWith(400);
                expect(responseMock.json).toHaveBeenCalledWith({
                    statusCode: 400,
                    message: "Not found",
                    error: "CometEntityNotFoundException",
                    validationErrors: [],
                });
            });

            it("response status is 400 and json is correct for CometValidationException", () => {
                const exceptionFilter = new ExceptionFilter(false);

                exceptionFilter.catch(new CometValidationException("Invalid", [{ property: "prop1" }]), httpHost);

                const responseMock = httpHost.switchToHttp().getResponse();
                expect(responseMock.status).toHaveBeenCalledWith(400);
                expect(responseMock.json).toHaveBeenCalledWith({
                    statusCode: 400,
                    message: "Invalid",
                    error: "CometValidationException",
                    validationErrors: [
                        {
                            property: "prop1",
                        },
                    ],
                });
            });

            it("response status is 401 and message is correct for HttpException", () => {
                const exceptionFilter = new ExceptionFilter(false);

                exceptionFilter.catch(new HttpException("Unauthorized", 401), httpHost);

                const responseMock = httpHost.switchToHttp().getResponse();
                expect(responseMock.status).toHaveBeenCalledWith(401);
                expect(responseMock.json).toHaveBeenCalledWith("Unauthorized");
            });

            it("response status is 500 and json is correct for normal Error in non-debug mode", () => {
                const exceptionFilter = new ExceptionFilter(false);

                exceptionFilter.catch(new Error("Other error"), httpHost);

                const responseMock = httpHost.switchToHttp().getResponse();
                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.json).toHaveBeenCalledWith({ message: "Internal Server Error", statusCode: 500 });
            });

            it("response status is 500 and json contains real error for normal Error in debug mode", () => {
                const exceptionFilter = new ExceptionFilter(true);

                exceptionFilter.catch(new Error("Other error"), httpHost);

                const responseMock = httpHost.switchToHttp().getResponse();
                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.json).toHaveBeenCalledWith({ message: "Other error", statusCode: 500 });
            });
        });
    });
});
