import { IsAlphanumeric, IsEmail, IsMobilePhone, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";


@InputType()
export class CreateAccountInput {
    @Field(()=> String)
    name: String

    @IsEmail()
    @Field(()=> String)
    email: String

    @IsMobilePhone()
    @Field(()=> String)
    phone: String

    @MinLength(8, {
        message:"Password must be at least 6 characters long",
    })
    // @IsAlphanumeric()
    @Field(()=> String)
    password: String
}


@InputType()
export class LoginInput {

    @IsEmail()
    @Field(()=> String)
    email: String

    @MinLength(8, {
        message:"Password must be at least 6 characters long",
    })
    // @IsAlphanumeric()
    @Field(()=> String)
    password: String

}
