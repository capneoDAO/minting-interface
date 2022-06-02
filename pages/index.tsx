import { useEffect, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from "next/image"
import { BigNumber, ethers } from 'ethers';
import { AiFillPlusCircle } from "react-icons/ai"
import { AiFillMinusCircle } from "react-icons/ai"
import { FaLinkedin, FaTelegramPlane, FaEthereum, FaInstagram, FaTwitter, FaMedium, FaYoutube } from "react-icons/fa";

import useConnectWeb3 from '../backend/connectWeb3';
import { approveUSDT, getUSDTAllowance, mintMany, mintSingle } from '../backend/contractInteraction';
import changeChain from '../backend/changeChain';
import { Chains } from '../lib/chains';
import { useAppSelector } from '../state/hooks';
import { Currency } from '../lib/enums';

import WalletModal from "../components/WalletModal";
import WalletButton from '../components/WalletButton';
import TransactionModal from "../components/TransactionModal"
import useContractInfo from '../backend/useContractInfo';

// #00E091
// #172721

const Home: NextPage = () => {
    const { chainId, address } = useAppSelector(state => state.account)
    const { web3Provider, disconnectWallet } = useConnectWeb3();
    const { activePhase, maxSupply, mintingFee, totalSupply } = useContractInfo(web3Provider, address, chainId)

    const [paymentMethod, setPaymentMethod] = useState(Currency.ETH)
    const [quantity, setQuantity] = useState(1)
    const [openModal, setOpenModal] = useState(false)
    const [transactionLoading, setTransactionLoading] = useState(true)
    const [transactionModal, setTransactionModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(true)
    const [hash, setHash] = useState("")
    const [NFTs, setNFTs] = useState({})
    const [showNFTs, setShowNFTs] = useState(false)
    const [number, setNumber] = useState(0)
    const [USDTAllowance, setUSDTAllowance] = useState(0)

    const increaseNumber = () => {
        if (number < 20) {
            setNumber(number + 1)
        } else if (number === 20) {
            setNumber(0)
        }
    }

    useEffect(() => {
        setTimeout(increaseNumber, 3000)
    }, [number])

    const getImageLink = () => {
        if (number < 3) {
            return `/images/nfts/${number}.jpeg`
        } else {
            return `/images/nfts/${number}.jpeg`
        }
    }

    const calcPrice = () => {
        if (mintingFee) {
            const finalPrice = (+mintingFee) * quantity
            return finalPrice
        }
    }

    const increase = () => {
        if (quantity < 20) {
            setQuantity(quantity + 1)
        }
    }

    const decrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    if (!transactionModal && !transactionLoading) {
        setTransactionModal(true)
    }

    const processTransaction = async (transaction: any) => {
        setHash(transaction.hash)
        setTransactionLoading(true)
        setTransactionModal(true)
        try {
            await transaction.wait();
            setSuccess(true)
            setTransactionLoading(false)
        } catch (error: any) {
            console.log(error)
            setHash(error.receipt.transactionHash)
            setSuccess(false)
            setTransactionLoading(false)
        }
    }

    const mint = async () => {
        setShowNFTs(false)
        if (quantity === 1) {
            const transaction = await mintSingle(web3Provider, mintingFee, paymentMethod)
            await processTransaction(transaction)
        } else {
            const transaction = await mintMany(web3Provider, quantity)
            await processTransaction(transaction)
        }
    }

    const approve = async () => {
        const transaction = await approveUSDT(web3Provider, address)
        await processTransaction(transaction)
    }

    const getAllowance = async () => {
        const allowance = await getUSDTAllowance(web3Provider, address)
        setUSDTAllowance(parseInt(allowance))
    }


    return (
        <>
            <Head>
                <title>MetaGameHub DAO</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
                {/* <meta name="robots" content="noodp,noydir" /> */}
            </Head>

            {openModal && <WalletModal onDismiss={() => setOpenModal(false)} />}

            {transactionModal && (
                <TransactionModal onDismiss={() => { setTransactionModal(false); !transactionLoading && window.location.reload() }} loading={transactionLoading} success={success} hash={hash} chainId={chainId} />
            )}

            <main className="flex flex-col w-screen pb-72">
                <div className="w-full flex justify-between items-center p-5 lg:p-10" >
                    <a href="https://www.metagamehub.io" target="_blank" className="transform hover:scale-110 transition-all duration-500 ease-in-out">
                        <img src="/images/capneo-logo.png" className={`h-12 lg:h-18`} />
                    </a>
                    <WalletButton onClick={() => setOpenModal(true)} disconnectWallet={disconnectWallet} />
                </div>


                <div className="flex flex-col items-center w-full">
                    <h2 className="text-white text-center mt-10 p-5">Public mint</h2>

                    <div className="flex flex-col max-w-lg lg:max-w-full lg:flex-row select-none rounded-xl p-5 xl:p-8 mx-5 sm:mx-20 lg:mx-0 items-stretch justify-evenly space-y-10 lg:space-y-0 space-x-0 lg:space-x-10 mt-20">

                        <img src={getImageLink()} className="rounded h-auto w-72" />

                        <div className="flex flex-col justify-center p-1 w-[100vw] max-w-xl">

                            <div className='flex w-full bg-white h-3 rounded mb-5'>
                                <div className={`bg-[#00E091] w-[20%] rounded`} />
                            </div>

                            <div className='flex justify-between text-white font-medium text-lg'>
                                <p>Total available:</p>
                                <p>{maxSupply}</p>
                            </div>

                            <div className='flex justify-between text-[#00E091] font-medium text-lg'>
                                <p>Already mined:</p>
                                <p>{totalSupply}</p>
                            </div>

                            <div className="flex items-center mt-10 justify-between space-x-5 sm:space-x-10 mb-5 px-3">
                                <p className="text-white font-medium text-2xl">Quantity: </p>
                                <div className="flex items-center space-x-0 sm:space-x-1 justify-center">
                                    <AiFillMinusCircle onClick={decrease} className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer" />
                                    <p className="text-[#00E091] text-4xl sm:text-5xl font-medium w-18 text-center pt-2">{quantity}</p>
                                    <AiFillPlusCircle onClick={increase} className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between space-x-5 sm:space-x-10 mb-5 px-3">
                                <p className="text-white font-medium text-2xl">Price: </p>
                                <p className='text-white font-medium text-2xl'>${calcPrice()}</p>
                            </div>

                            <div className="flex items-center justify-between space-x-5 sm:space-x-10 mb-5 px-3">
                                <p className="text-white font-medium text-2xl">Payment: </p>
                                <div className='flex space-x-5'>
                                    <img src="/images/ETH.webp" onClick={() => setPaymentMethod(Currency.ETH)} className={`h-12 ${paymentMethod === Currency.ETH ? "opacity-100" : "opacity-20"}`} />
                                    <img src="/images/USDC.webp" onClick={() => setPaymentMethod(Currency.USDC)} className={`h-12 ${paymentMethod === Currency.USDC ? "opacity-100" : "opacity-20"}`} />
                                    <img src="/images/USDT.webp" onClick={() => { setPaymentMethod(Currency.USDT); getAllowance() }} className={`h-12 ${paymentMethod === Currency.USDT ? "opacity-100" : "opacity-20"}`} />
                                </div>
                            </div>



                            {!web3Provider && (
                                <button onClick={() => setOpenModal(true)} className="self-center mt-10 border hover:border-[#00E091] hover:text-[#00E091] w-34 xs:w-36 sm:w-44 md:w-52 flex items-center justify-center cursor-pointer text-gray-200 font-medium text-base sm:text-lg md:text-xl rounded-xl p-1.5 sm:p-2 md:p-3 transition ease-in-out duration-300">
                                    <span className="pt-1 z-10 font-medium text-lg sm:text-xl">Connect Wallet</span>
                                </button>
                            )}
                            {web3Provider && chainId === Chains.ETHEREUM_RINKEBY.chainId && (<>
                                <button disabled={loading} onClick={mint} className="self-center mt-10 border hover:border-[#00E091] hover:text-[#00E091] w-34 xs:w-36 sm:w-44 md:w-52 flex items-center justify-center cursor-pointer text-gray-200 font-medium text-base sm:text-lg md:text-xl rounded-xl p-1.5 sm:p-2 md:p-3 transition ease-in-out duration-300">
                                    <span className="pt-1 z-10 font-medium text-lg sm:text-xl">Mint NFTs</span>
                                </button>
                            </>
                            )}
                            {web3Provider && chainId !== Chains.ETHEREUM_RINKEBY.chainId && (
                                <button disabled={loading} onClick={() => { changeChain(web3Provider.provider, Chains.ETHEREUM_RINKEBY.chainId) }} className="self-center mt-10 border hover:border-[#00E091] hover:text-[#00E091] w-34 xs:w-36 sm:w-44 md:w-64 flex items-center justify-center cursor-pointer text-gray-200 font-medium text-base sm:text-lg md:text-xl rounded-xl p-1.5 sm:p-2 md:p-3 transition ease-in-out duration-300">
                                    <span className="pt-1 z-10 font-medium text-lg sm:text-xl">Switch to Rinkeby</span>
                                </button>
                            )}

                            {web3Provider && paymentMethod === Currency.USDT && !+USDTAllowance && chainId === Chains.ETHEREUM_RINKEBY.chainId && (
                                <button disabled={loading} onClick={approve} className="self-center mt-10 border hover:border-[#00E091] hover:text-[#00E091] w-34 xs:w-36 sm:w-44 md:w-64 flex items-center justify-center cursor-pointer text-gray-200 font-medium text-base sm:text-lg md:text-xl rounded-xl p-1.5 sm:p-2 md:p-3 transition ease-in-out duration-300">
                                    <span className="pt-1 z-10 font-medium text-lg sm:text-xl">Approve USDT</span>
                                </button>
                            )}
                        </div>
                    </div>

                </div>




                {loading && (
                    <div className="w-full h-full self-center flex items-center justify-center mt-10">
                        <img src="/images/capneo-logo.png" className={` h-24 w-24 animate-rotate`} />
                    </div>
                )}

                {/* {showNFTs && address && (
                    Object.entries(NFTs).length === 0 ? (
                        <p className="font-medium text-lg text-gray-300 my-10 text-center self-center px-5">You have no Meta NFT Portraits in your Wallet</p>
                    ) : (
                        <div className="flex items-center justify-center flex-wrap w-screen h-auto py-10 my-10">
                            {Object.entries(NFTs).map(([id, imageLink]: any) => {
                                return (
                                    <div key={id} className="relative w-4/12 lg:w-2/12">
                                        <div className="absolute top-0 left-0 w-full h-full backdrop-filter backdrop-blur-xl bg-black bg-opacity-30 flex flex-col items-center justify-center p-2 opacity-0 hover:opacity-100 transition ease-in-out duration-300 cursor-pointer">
                                            <a href={`https://opensea.io/assets/0x657c7e3b1d32bc4e757a2648a004d2f50d83d6a0/${id}`} target="_blank" className="text-gray-200 text-lg font-medium text-center">View on Opensea</a>
                                        </div>
                                        <img src={imageLink} className="w-full h-auto" />
                                    </div>
                                )
                            })}
                        </div>
                    )
                )} */}


                {/* <div className="relative w-full h-60 xs:h-72 lg:h-96 overflow-hidden mt-10">
                    <img src="/images/capneo-logo.png" className="w-3/4 absolute top-10 -left-1/4 blur sm:blur-md lg:blur-xl" />
                    <div className="flex flex-row items-center w-full justify-center sm:justify-end flex-wrap space-x-3 absolute bottom-0 right-0 p-8 xs:p-10">
                        <a href="https://metagamehub.medium.com" className="cursor-pointer" target="_blank" >
                            <FaMedium className="social-media-icon" />
                        </a>

                        <a href="https://www.instagram.com/metagamehub_dao/" className="cursor-pointer" target="_blank" >
                            <FaInstagram className="social-media-icon" />
                        </a>

                        <a href="https://www.linkedin.com/company/metagamehub-dao/" className="cursor-pointer" target="_blank" >
                            <FaLinkedin className="social-media-icon" />
                        </a>

                        <a href="https://twitter.com/MGH_DAO" className="cursor-pointer" target="_blank" >
                            <FaTwitter className="social-media-icon" />
                        </a>

                        <a href="https://t.me/metagamehub_dao" className="cursor-pointer" target="_blank" >
                            <FaTelegramPlane className="social-media-icon" />
                        </a>

                        <a href="https://www.youtube.com/channel/UC6lHXEEmjGiRmIVmiS0odpw" className="cursor-pointer" target="_blank" >
                            <FaYoutube className="social-media-icon" />
                        </a>
                        <a href="https://etherscan.io/token/0x8765b1a0eb57ca49be7eacd35b24a574d0203656#balances" className="cursor-pointer" target="_blank" >
                            <FaEthereum className="social-media-icon" />
                        </a>
                    </div>
                </div> */}
            </main>




        </>
    )
}

export default Home
