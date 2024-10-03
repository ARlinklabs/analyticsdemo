import React, { useEffect, useState } from 'react';
import { message } from "@permaweb/aoconnect";
import Arweave from 'arweave';
import * as WarpArBundles from 'warp-arbundles';
import { useLocation } from 'react-router-dom';

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// Setup WarpArBundles
const pkg = WarpArBundles.default ? WarpArBundles.default : WarpArBundles;
const { createData, ArweaveSigner } = pkg;

// Custom createDataItemSigner function
function createDataItemSigner(wallet) {
  const signer = async ({ data, tags, target, anchor }) => {
    const signer = new ArweaveSigner(wallet);
    const dataItem = createData(data, signer, { tags, target, anchor });
    return dataItem.sign(signer).then(async () => ({
      id: await dataItem.id,
      raw: await dataItem.getRaw(),
    }));
  };

  return signer;
}

const AnalyticsWrapper = ({ children, processId }) => {
  const [wallet, setWallet] = useState(null);
  const location = useLocation();
  console.log("current location:", location.pathname);

  console.log("processId:", processId);

  useEffect(() => {
    const generateWallet = async () => {
      try {
        let key = await arweave.wallets.generate();
        setWallet(key);
        console.log("Wallet generated");
        
        const address = await arweave.wallets.jwkToAddress(key);
        console.log("Wallet address:", address);
      } catch (error) {
        console.error("Error generating wallet:", error);
      }
    };

    generateWallet();
  }, []);

  useEffect(() => {
    const sendAnalytics = async () => {
      if (!wallet) return;

      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const currentPage = location.pathname;
      console.log("Current month:", currentMonth);
      console.log("Current page:", currentPage);

      try {
        const result = await message({
          process: processId,
          tags: [
            { name: 'Action', value: 'Analytics.IncrementVisitor' },
            { name: 'Month', value: currentMonth },
            { name: 'Page', value: currentPage },
          ],
          data: "",
          signer: createDataItemSigner(wallet),
        });
        console.log('Analytics result:', result);
      } catch (error) {
        console.error("Error sending analytics:", error);
      }
    };

    sendAnalytics();
  }, [processId, wallet, location.pathname]);

  return <>{children}</>;
};

export default AnalyticsWrapper;