import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
const isValidDomain = require('is-valid-domain');
@ValidatorConstraint({ async: false })
export class IsDomainConstraint implements ValidatorConstraintInterface {
    validate(domainName: any, args: ValidationArguments) {
        return (
            typeof domainName === 'string' &&
            isValidDomain(domainName?.replace('https://', ''))
        );
    }

    defaultMessage(args: ValidationArguments) {
        return 'Domain Name Must Be A Valid Domain';
    }
}
export function IsDomain(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsDomainConstraint
        });
    };
}
