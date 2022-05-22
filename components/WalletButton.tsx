import { useAppSelector } from "../state/hooks"
import { ellipseAddress } from "../lib/utilities"

const WalletButton = ({ onClick, disconnectWallet }: any) => {

    const { address } = useAppSelector(state => state.account)


    return (
        <>
            <div className={`relative ${address && "group"}`}>
                <div onClick={address ? undefined : onClick} className="border hover:border-[#00E091] hover:text-[#00E091] w-34 xs:w-36 sm:w-44 md:w-52 flex items-center justify-center cursor-pointer text-gray-200 font-medium text-base sm:text-lg md:text-xl rounded-xl p-1.5 sm:p-2 md:p-3 transition ease-in-out duration-300">
                    {/* <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80" /> */}
                    <span className="pt-1 z-10">{address ? ellipseAddress(address) : "Connect Wallet"}</span>
                </div>
                <div onClick={disconnectWallet} className="group-hover:flex w-34 xs:w-36 sm:w-44 md:w-52 hidden items-center justify-center cursor-pointer text-gray-200 font-medium text-base sm:text-lg md:text-xl rounded-xl p-1.5 sm:p-2 md:p-3 group shadow-black overflow-hidden transition ease-in-out duration-500">
                    <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80" />
                    <span className="pt-1 z-10">Disconnect</span>
                </div>
            </div>
        </>
    )
}


export default WalletButton
