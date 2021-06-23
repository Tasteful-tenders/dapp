import {Contract, providers} from "ethers";
import {AUCTION_ABI, AUCTION_ADDR, NFT_FACTORY_ABI, NFT_FACTORY_ADDR, TTK_ABI, TTK_ADDR} from "./constants";

export class ContractHelper {

    public nftFactory: Contract;
    public tendersToken: Contract;
    public auction: Contract;

    private static instance?: ContractHelper;

    public static getInstance(): ContractHelper|undefined {
        return ContractHelper.instance;
    }

    public static init(web3Provider: any): ContractHelper {
        const nftFactory = new Contract(NFT_FACTORY_ADDR, NFT_FACTORY_ABI, web3Provider);
        const nftFactoryWithSigner = nftFactory.connect(web3Provider.getSigner());

        const tendersToken = new Contract(TTK_ADDR, TTK_ABI, web3Provider);
        const tendersTokenWithSigner = tendersToken.connect(web3Provider.getSigner());

        const auction = new Contract(AUCTION_ADDR, AUCTION_ABI, web3Provider);
        const auctionWithSinger = auction.connect(web3Provider.getSigner());

        this.instance = new ContractHelper(nftFactoryWithSigner, tendersTokenWithSigner, auctionWithSinger);
        return this.instance;
    }

    private constructor(nftFactory: Contract, tendersToken: Contract, auction: Contract) {
        this.nftFactory = nftFactory;
        this.tendersToken = tendersToken;
        this.auction = auction;
    }

}