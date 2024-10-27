import { NextResponse } from "next/server"


export const GET = async () => {
    try {
        const response = NextResponse.json({ message: "User LogOut successfully", success: true, error: false }, { status: 200 })
        response.cookies.set("next-auth.callback-url", "", {
            expires: new Date(0),
            httpOnly: true

        });

        response.cookies.set("next-auth.csrf-token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        response.cookies.delete("next-auth.csrf-token");
        response.cookies.set("next-auth.session-token", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        return response

    } catch (error) {
        console.log(error);
    }
};