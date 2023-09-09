import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import bcrypt from 'bcryptjs'


@pre<Account>('save', function () {
    this.password = bcrypt.hashSync(this.password, 10)
})

@ObjectType()
export class Account {
    @Field(()=> String)
    _id: String

    @Field(()=> String)
    @prop({ required: true, })
    name: String

    @Field(()=> String)
    @prop({ required: true, index: true, })
    email: String

    
    @Field(()=> String)
    @prop({ required: true, })
    phone: String

    // no graphql type for this so noone can query it
    @prop({ required: true, index: true, })
    password: String


    @Field(()=> Number)
    @prop({ required: true, })
    joinedOn: String
}


@ObjectType()
export class AuthTokens {
    
    @Field(()=> String)
    accessToken: String
    
    @Field(()=> String)
    refreshToken: String

}


@ObjectType()
export class AuthenticationResult {

    
    @Field(()=> Account)
    account: Account
    
    @Field(()=> AuthTokens)
    tokens: AuthTokens

}


export const AccountModel = getModelForClass(Account)
