import { SignIn } from "@clerk/nextjs";
import '../../css/clerk.css';
export default function Page() {
    console.log("inside sign in")
    return <SignIn className='mainContainer'/>;
}