import { Resolver, Query, Arg, Mutation, Ctx, Authorized, } from "type-graphql";
import { Account, AccountModel, AuthenticationResult } from "./types";
import { CreateAccountInput, LoginInput } from "./inputs";
import { generateAccessToken, generateRefreshtoken } from "../utils/authentication";
import bcrypt from 'bcryptjs'
import { Context } from "../types";


@Resolver()
export class AccountResolvers {

    @Mutation(()=> AuthenticationResult)
    async createAccount(
        @Arg("input") input: CreateAccountInput
    ) {

        const { name, email, password, phone, } = input
        console.log("args ", name, email, password, phone,)
        // console.log("parent ", parent)
        // console.log("context ", context)

        // check if email is used
        const emailResult = await AccountModel.findOne({ email, }).lean()

        if( emailResult ) {
            throw null
        }

        // add user
        const account = await new AccountModel({
            name,
            email,
            password,
            phone,
            joinedOn: Date.now(),
        }).save()

        // generate jwts
        const accessToken = generateAccessToken(account)
        const refreshToken = generateRefreshtoken(account)

    
        // return account
        return {
            account,
            tokens: {
                accessToken,
                refreshToken,
            },
        }
    }


    @Mutation(()=> AuthenticationResult)
    async login( @Arg("input") input: LoginInput ) {
        console.log("input ", input);
        
        const { email, password } = input
        console.log("args ", email, password)
    
        // get user with the email
        const account = await AccountModel.findOne({ email, }).lean()
    
        // if no result, return
        if( !account ) {
            throw new Error("400")
        }
    
        // verify password
        const isMatch = bcrypt.compare(password, account?.password)
    
        if( !isMatch ) {
            
            throw new Error("400")
        }
    
        // generate jwts
        const accessToken = generateAccessToken(account)
        const refreshToken = generateAccessToken(account)
    
        return {
            account,
            tokens: {
                accessToken,
                refreshToken,
            },
        }
    }

    @Authorized()
    @Query(()=> [Account])
    async allAccounts(
        // @Arg("filters") filters: FiltersInput,
        @Ctx() context: Context
    ) {

        console.log("context user ", context.user)

        return await AccountModel.find({}).lean()
    }

}
