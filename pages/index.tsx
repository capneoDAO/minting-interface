import { useEffect, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from "next/image"
import { BigNumber, ethers } from 'ethers';
import { AiFillPlusCircle } from "react-icons/ai"
import { AiFillMinusCircle } from "react-icons/ai"
import { FaLinkedin, FaTelegramPlane, FaEthereum, FaInstagram, FaTwitter, FaMedium, FaYoutube } from "react-icons/fa";

import useConnectWeb3 from '../backend/connectWeb3';
import { getNFTs, getNFTQuantity, mintNFT } from '../backend/contractInteraction';
import changeChain from '../backend/changeChain';
import { Chains } from '../lib/chains';
import { useAppSelector } from '../state/hooks';

import WalletModal from "../components/WalletModal";
import WalletButton from '../components/WalletButton';
import TransactionModal from "../components/TransactionModal"

// #00E091
// #172721

const Home: NextPage = () => {
    const { chainId, address } = useAppSelector(state => state.account)
    const { web3Provider, disconnectWallet } = useConnectWeb3();

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

    const increaseNumber = () => {
        if (number < 12) {
            setNumber(number + 1)
        } else if (number === 12) {
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
        if (process.env.NEXT_PUBLIC_PRICE) {
            const finalPrice = (+process.env.NEXT_PUBLIC_PRICE) * quantity
            return finalPrice.toFixed(2)
        }
    }

    const increase = () => {
        if (quantity < 10) {
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
        const transaction = await mintNFT(web3Provider, quantity)
        await processTransaction(transaction)
    }

    const getData = async () => {
        setShowNFTs(false)
        setLoading(true)
        const qty: BigNumber = await getNFTQuantity(web3Provider, address)
        const result = await getNFTs(web3Provider, address, qty.toNumber())
        if (result) {
            setNFTs(result)
        }
        setLoading(false)
        setShowNFTs(true)
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

            <main className="flex flex-col w-screen">
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
                                <div className='bg-[#00E091] w-[20%] rounded' />
                            </div>

                            <div className='flex justify-between text-white font-medium text-lg'>
                                <p>Total available:</p>
                                <p>12500</p>
                            </div>

                            <div className='flex justify-between text-[#00E091] font-medium text-lg'>
                                <p>Already mined:</p>
                                <p>100</p>
                            </div>

                            <input type='number' placeholder="amount" className='my-10 w-32 rounded px-2 py-2 text-xl font-medium self-center'/>

                            <div className='flex space-x-5 self-center'>
                                <img src="/images/ETH.webp" className='h-12'/>
                                <img src="/images/USDC.webp" className='h-12'/>
                                <img src="/images/USDT.webp" className='h-12'/>
                            </div>

                            <p className='self-center mt-10 text-white font-medium text-2xl'>Price: $500</p>

                            {!web3Provider && (
                                <button onClick={() => setOpenModal(true)} className="self-center mt-10 border hover:border-[#00E091] hover:text-[#00E091] w-34 xs:w-36 sm:w-44 md:w-52 flex items-center justify-center cursor-pointer text-gray-200 font-medium text-base sm:text-lg md:text-xl rounded-xl p-1.5 sm:p-2 md:p-3 transition ease-in-out duration-300">
                                    <span className="pt-1 z-10 font-medium text-lg sm:text-xl">Connect Wallet</span>
                                </button>
                            )}
                            {web3Provider && chainId === Chains.ETHEREUM_MAINNET.chainId && (<>
                                <button disabled={loading} onClick={mint} className="disabled:opacity-50 disabled:cursor-default mt-4 relative flex justify-center items-center shadow-black rounded-xl w-full py-3 sm:py-4 group self-center">
                                    <div className="h-full w-full absolute bg-pink-600 transition-all ease-in-out duration-300 rounded-xl opacity-100 group-disabled:group-hover:opacity-100 group-hover:opacity-80" />
                                    <span className="pt-1 z-10 text-grey-darkest font-medium text-lg sm:text-xl">Mint NFTs</span>
                                </button>
                                <button disabled={loading} onClick={getData} className="disabled:opacity-50 disabled:cursor-default mt-4 relative flex justify-center items-center transition ease-in-out duration-300 rounded-xl w-full py-3 sm:py-4 group self-center">
                                    <div className="h-full w-full absolute border border-pink-600 transition-all ease-in-out duration-300 rounded-xl opacity-100 group-disabled:group-hover:opacity-100 group-hover:opacity-80" />
                                    <span className="pt-1 z-10 text-pink-600 font-medium text-lg sm:text-xl transition-all ease-in-out duration-300 text-opacity-100 group-disabled:group-hover:text-opacity-100 group-hover:text-opacity-80">Show my NFTs</span>
                                </button>
                            </>
                            )}
                            {web3Provider && chainId !== Chains.ETHEREUM_MAINNET.chainId && (
                                <button onClick={() => { changeChain(web3Provider.provider, Chains.ETHEREUM_MAINNET.chainId) }} className="z-30 mt-4 relative flex justify-center items-center transition ease-in-out duration-500 rounded-xl w-full py-3 sm:py-4 group self-center">
                                    <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl opacity-60 group-hover:opacity-80" />
                                    <span className="pt-1 z-10 text-gray-200 font-medium text-lg sm:text-xl">Switch to Ethereum</span>
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

                {showNFTs && address && (
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
                )}


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
