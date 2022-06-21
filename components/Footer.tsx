import Link from "next/link";
import { useState } from "react";
import { FaLinkedin, FaTelegramPlane, FaDiscord, FaEthereum, FaInstagram, FaTwitter, FaMedium, FaYoutube } from "react-icons/fa";


const Footer = () => {
    const [processing, setProcessing] = useState(false)
    const [message, setMessage] = useState("")
    const [email, setEmail] = useState("")

    const formSubmitted = async (e: any) => {
        e.preventDefault();
        setProcessing(true)
        let message;
        try {
            const res = await fetch("/api/addContact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email_address: email })
            });
            message = await res.json()
            setMessage(message.message)
            setProcessing(false)
        } catch (e) {
            setMessage("Something went wrong, try again later!")
            setProcessing(false)
        }
    }

    return (
        <footer className="mt-20 relative flex flex-col lg:flex-row justify-around items-center space-y-20 lg:space-y-0 space-x-0 lg:space-x-10 px-2 sm:px-10 py-10 w-full text-white overflow-hidden bg-[#00E091]">

            <div className="flex flex-col justify-start items-center space-y-2 backdrop-blur-lg rounded p-4 sm:p-5">

                <p className="text-sm sm:text md:text-lg lg:text-base text-center font-medium">Subscribe to our newsletter for juicy updates!</p>

                <form onSubmit={formSubmitted} onFocus={() => setMessage("")} className="relative flex items-center w-full max-w-sm">
                    <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" required className="bg-transparent font-medium w-full border text-white py-3 px-4 focus:outline-none rounded-full placeholder-white placeholder-opacity-80" />
                    <button className="absolute flex items-center justify-around bg-white right-0 h-4/5 rounded-full mr-1 w-1/6">
                        <svg className={`${processing ? "block" : "hidden"} animate-spin-slow h-6 w-6 border-4 border-t-white border-l-white border-gray-800 rounded-full `} />
                        <span className={`${processing ? "hidden" : "block"} text-black font-medium  w-full`}>Join</span>
                    </button>
                </form>
                <p className="text-xs text-white font-medium mt-2">{message}</p>

                <p className="text-sm sm:text md:text-lg lg:text-base text-center font-medium pt-3 sm:pt-6">Stay in touch!</p>

                <div className="flex flex-row items-center justify-center flex-wrap space-x-2 sm:space-x-5 ">

                    <a href="https://metagamehub.medium.com" className="cursor-pointer" target="_blank" >
                        <FaMedium className="social-media-icon" />
                    </a>

                    <a href="https://www.linkedin.com/company/metagamehub-dao/" className="cursor-pointer" target="_blank" >
                        <FaLinkedin className="social-media-icon" />
                    </a>

                    <a href="https://twitter.com/MGH_DAO" className="cursor-pointer" target="_blank" >
                        <FaTwitter className="social-media-icon" />
                    </a>

                    <a href="https://discord.gg/8WJVMDXZwH" className="cursor-pointer" target="_blank" >
                        <FaDiscord className="social-media-icon" />
                    </a>

                </div>

            </div>


            <div className="flex text-white items-center space-x-1 absolute bottom-4 right-5 text-sm">
                <a href="/terms" className=' hover:text-blue-500 transition ease-linear duration-200'>Terms of Use</a>
                <hr className="border-white w-3 rotate-90" />
                <a href="/privacy" className=' hover:text-blue-500 transition ease-linear duration-200'>Privacy Policy</a>
            </div>


        </footer>
    )
}

export default Footer
