import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { Provider } from "../lib/enums";
import { removeLocal } from "../lib/local";
import { useAppDispatch } from "../state/hooks";
import { disconnect, setAddress, setChain } from "../state/account";

import useProvider from "./provider";


export default function useConnectWeb3() {
  const [web3Provider, setweb3Provider] = useState<ethers.providers.Web3Provider>()
  const dispatch = useAppDispatch()
  const provider = useProvider()

  useEffect(() => {
    if (!provider) {
      setweb3Provider(undefined)
      return
    }

    const ethersWeb3Provider = new ethers.providers.Web3Provider(provider, "any");
    setweb3Provider(ethersWeb3Provider)

    ethersWeb3Provider.listAccounts().then(res => {
      dispatch(setAddress(res[0]))
    })

    ethersWeb3Provider.getNetwork().then(res => {
      dispatch(setChain(res.chainId))
    })

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      }
      console.log("accountsChanged", accounts);
    }

    const handleChainChanged = (newChainId: string) => {
      window.location.reload();
      console.log("chainChanged", newChainId);
    }

    const handleConnect = (info: { chainId: number }) => {
      console.log(info)
    }

    const handleDisconnect = (error: { code: number; message: string }) => {
      console.log(error)
    }

    provider.on("accountsChanged", handleAccountsChanged)
    provider.on("chainChanged", handleChainChanged)
    provider.on("connect", handleConnect);
    provider.on("disconnect", handleDisconnect);

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged)
        provider.removeListener('chainChanged', handleChainChanged)
        provider.removeListener('connect', handleConnect)
        provider.removeListener('disconnect', handleDisconnect)
      }
    }
  }, [provider])

  const disconnectWallet = async () => {
    if (provider === Provider.WALLETCONNECT) {
      await provider.disconnect()
    }
    removeLocal("provider")
    dispatch(disconnect())
  }

  return { web3Provider, disconnectWallet }

}
