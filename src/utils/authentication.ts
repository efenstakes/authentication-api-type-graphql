import { AuthChecker } from "type-graphql"
import { Context } from "../types"

const jwt = require('jsonwebtoken')


// For reference
// TIME
// 3600 * 24  => 1 day

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
export const authenticateAuthorizationHeaders = async (req, res, next) => {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            req.user = null
            // console.log('no authorization')
            next()
            return
        }
        

        const idToken = req.headers.authorization.split(' ')[1];
        try {
            const payload = jwt.verify(idToken, process.env.ACCESS_TOKEN_SECRET)
            // console.debug('payload ', payload)
            // const account_result = await accounts_model.findById(payload.id)

            if( !payload ) {
                req.user = null
                next()
                return
            }

            const { password, ...user } = payload
            req.user = user

            next()
            return
        } catch(e) {
            req.user = null
            next()
            return
        }
}



// Express middleware that validates Firebase ID Tokens passed in the http cookies.
// The Firebase ID token needs to be passed as a Bearer token in the http cookies header like this:
// `Cookies: APP_TOKEN <Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
export const authenticateCookies = async (req, res, next) => {
    const accessToken = req.cookies?.ACCESS_TOKEN
    const refreshToken = req.cookies?.REFRESH_TOKEN

    console.log("access_token ", accessToken)
    console.log("refresh_token ", refreshToken)

    if( !accessToken ) {
        next()
        return
    }
    // next()
    
    try {
        const payload = verifyAccessToken(accessToken)
        // console.log("payload ", payload)
        const refreshPayload = verifyRefreshToken(refreshToken)
        console.log("refresh_token ", refreshToken)

        let user_data = null
        
        if( !payload ) {
            console.log("if( !payload ) {")
        }
        
        if( !payload && refreshPayload ) {
            console.log(" if( refresh_payload ) {")
            // if expired
            // generate new access token
            const { password, ...user } = refreshPayload

            console.log("user ", user)

            res.cookie('ACCESS_TOKEN', generateAccessToken(user), { maxAge: 3600 * 24 * 30 * 3, httpOnly: false })
            res.cookie('REFRESH_TOKEN', generateRefreshtoken(user), { maxAge: 3600 * 24 * 60 * 6, httpOnly: false })
            
            user_data = user
        }
        
        if( payload ) {
            console.log("} else if( payload ) {")
            const { password, ...user } = payload
            user_data = user
        }

        console.log("setting user in auth cookies => ", user_data)
        req.user = user_data

        next()
        return
    } catch(e) {
        req.user = null
        next()
        return
    }
}





export const generateAccessToken = (account) => {
    return jwt.sign(
        { ...account }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '.25y', subject: account._id.toString() }
    )
}

export const generateRefreshtoken = (account) => {
    return jwt.sign(
        { ...account }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '.5y', subject: account._id.toString() }
    )
}


export const verifyAccessToken = (token)=> {
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return payload
    } catch (e) {
        console.log("Error in verify_access_token ", e)
        return null
    }
}

export const verifyRefreshToken = (token)=> {
    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        return payload
    } catch (e) {
        console.log("Error in verify_access_token ", e)
        return null
    }
}


export const authChecker: AuthChecker<Context> = ({ context: { user, } })=> {

    return user != null || user != undefined
}