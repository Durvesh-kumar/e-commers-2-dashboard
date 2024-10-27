import 'next-auth'
import { DefaultSession } from 'next-auth';
import { CollectionType } from './type';

declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        role: string;
        name?: string;
        collections?: string | CollectionType
    }

    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            role: string;
            name?: string,
            collections?: string | CollectionType
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        role: string;
        name?: string
        exp?:number | string;
        collections?: string | CollectionType
    }
}