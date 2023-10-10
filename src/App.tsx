import React, { useState, useEffect, useRef } from "react";
import {useRoutes, Link} from "react-router-dom";
import { useAutoConnect } from "./contexts/AutoConnectProvider";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import routes from "./router";
import Footer from './components/Footer';
import "./styles/reset.less";
import "tailwindcss/tailwind.css";
import "./styles/app.less";
import "@solana/wallet-adapter-react-ui/styles.css";
import {Connection, PublicKey} from "@solana/web3.js";
import NetworkSwitcher from "./components/NetworkSwitcher";
import {useNetworkConfiguration} from "./contexts/NetworkConfigurationProvider";


const App: React.FC = () => {
  const element = useRoutes(routes);
  const [showButton, setShowButton] = useState(false);
  const { networkConfiguration, setNetworkConfiguration } = useNetworkConfiguration();
  const [balance, setBalance] = useState(0);
  const { autoConnect, setAutoConnect } = useAutoConnect();

  useEffect(() => {
    getAccountBalance();
  }, [networkConfiguration])

  const getAccountBalance = async () => {
    try {
      const connection = new Connection(`https://api.${networkConfiguration}.solana.com`);

      // 解析公钥
      const publicKey = new PublicKey('3XKoxvhWnkNbtkdMNQR85yiiuscgYiEDVRML9XmY6YEF');
      // 查询账户余额
      const balance = await connection.getBalance(publicKey);
      setBalance(balance);
    } catch (error) {
      console.error('Failed to get account balance:', error);
      throw error;
    }
  }

  const scrollRef = useRef(null);

  const scrollToTop = () => {
    const element = scrollRef.current;
    // @ts-ignore
    element.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  useEffect(() => {
    getAccountBalance()
    const handleScroll = () => {
      const element = scrollRef.current;
      // @ts-ignore
      setShowButton(element.scrollTop > 300)
    };

    // @ts-ignore
    scrollRef.current.addEventListener('scroll', handleScroll);

    return () => {
      // @ts-ignore
      scrollRef.current.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="layout font-body" id='scrollBox' ref={scrollRef}>
      <header className='h-[96px]  bg-[#273141]'>
        <div className='w-[1000px] h-[96px] mx-auto flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <Link to='/'>
                <img className="logo" src="/images/logo1.png" alt=""/>
              </Link>
            </div>
            <div className='ml-6 flex items-baseline space-x-20'>
              <Link
                to='/'
                className='text-white text-2xl font-semibold hover:opacity-80'
              >
                Power Voting
              </Link>
            </div>
          </div>
          <div className='flex items-center justify-around'>
            <WalletMultiButton className="btn-ghost btn-sm rounded-btn text-lg mr-6 " />
            <div>
              <span className="block h-0.5 w-12 bg-[#7F8FA3] rotate-90 ml-2"></span>
            </div>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-square btn-ghost text-right">
                <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-100 rounded-box sm:w-52">
                <li>
                  <div className="form-control bg-opacity-100">
                    <label className="cursor-pointer label">
                      <a>Balance</a>
                      <div>{balance / 1000000000} SOL</div>
                    </label>
                    <label className="cursor-pointer label">
                      <a>Autoconnect</a>
                      <input type="checkbox" checked={autoConnect} onChange={(e) => setAutoConnect(e.target.checked)} className="toggle" />
                    </label>
                    <NetworkSwitcher />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <div className='content w-[1000px] mx-auto pt-10 pb-10'>
        {element}
      </div>
      <Footer/>
      <button onClick={scrollToTop} className={`${showButton ? '' : 'hidden'} fixed bottom-[6rem] right-[6rem] z-40  p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none`}>
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 3l-8 8h5v10h6V11h5z" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}

export default App