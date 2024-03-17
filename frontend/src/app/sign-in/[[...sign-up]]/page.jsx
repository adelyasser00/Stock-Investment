import { SignIn } from "@clerk/nextjs";
import '../../css/clerk.css';
export default function Page() {
    return <SignIn className='mainContainer'/>;
}