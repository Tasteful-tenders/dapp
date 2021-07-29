import {BigNumber, Contract} from "ethers";
import {AUCTION_ABI, AUCTION_ADDR, NFT_FACTORY_ABI, NFT_FACTORY_ADDR, TTK_ABI, TTK_ADDR} from "./constants";

export interface ITender {
    owner: string;
    startPrice: BigNumber;
    endDate: BigNumber;
    highestBidder: string;
    highestBid: BigNumber;
    active: boolean;
}

export interface INFTData {
    id: BigNumber;
    title: string;
    author: string;
    description: string;
    ipfsHash: string;
}

export class ContractHelper {

    public nftFactory: Contract;
    public tendersToken: Contract;
    public auction: Contract;

    private static instance?: ContractHelper;

    public static getInstance(): ContractHelper | undefined {
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

    public async fetchAllNftIds(): Promise<any[]> {
        const events: any[] = await this.nftFactory.queryFilter(this.nftFactory.filters.Transfer('0x0000000000000000000000000000000000000000'));
        return events.map((log: any) => {
            return log.args.tokenId;
        });
    }

    public async fetchAllBids(nftId: BigNumber): Promise<any[]> {
        return await this.auction.queryFilter(this.auction.filters.logBid(nftId));
    }

    //find all bids event with a given address
    public async fetchAllUserBids(address: string): Promise<any[]> {
        return await this.auction.queryFilter(this.auction.filters.logBid(null, address));
    }

    //find all active tenders for a given address and nftIds array
    public async fetchAllUserActiveBids(address: string, nftIds: BigNumber[]): Promise<ITender[]> {
        const tenders: ITender[] = await this.fetchAllTenders(nftIds);
        return tenders.filter((tender) => {
            return tender.active;
        });
    }

    public async fetchAllTenders(nftIds: any[]): Promise<ITender[]> {
        return await Promise.all(nftIds.map(async (id) => {
            const tender = await this.auction.tenders(id);
            return {
                owner: tender.owner,
                startPrice: tender.startPrice,
                endDate: tender.endDate,
                highestBidder: tender.highestBidder,
                highestBid: tender.highestBid,
                active: tender.active
            }
        }));
    }

    public async fetchAllNftData(nftIds: any[]): Promise<INFTData[]> {
        return await Promise.all(nftIds.map(async (id) => {
            return await this.getNftData(id);
        }));
    }

    public async getNftData(nftId: BigNumber): Promise<INFTData> {
        const tokenURI: string = await this.nftFactory.tokenURI(nftId);
        try {
            JSON.parse(tokenURI);
        } catch (e) {
            try {
                JSON.parse(tokenURI.slice(1, tokenURI.length - 1));
            } catch (e) {
                console.log('impossible to parse nft n°' + nftId.toNumber() + ' returning empty object');
                return {
                    id: nftId,
                    title: '',
                    author: '',
                    description: '',
                    ipfsHash: ''
                };
            }
            return {
                ...JSON.parse(tokenURI.slice(1, tokenURI.length - 1)),
                id: nftId
            };
        }
        return {
            ...JSON.parse(tokenURI),
            id: nftId
        };
    }

    public async fetchOwnedNftIds(address: string): Promise<BigNumber[]> {
        const balanceOf = await this.nftFactory.balanceOf(address);
        if (balanceOf === BigNumber.from(0)) {
            return [];
        }
        const received: any[] = await this.nftFactory.queryFilter(this.nftFactory.filters.Transfer(null, address));
        let ownedNfts: BigNumber[] = [];
        await Promise.all(received.map(async (log) => {
            const owner = await this.nftFactory.ownerOf(log.args.tokenId);
            if (owner === address) {
                ownedNfts.push(log.args.tokenId);
            }
        }));
        return ownedNfts;
    }

    public async fetchCreatedNftIds(address: string): Promise<BigNumber[]> {
        const created: any[] = await this.nftFactory.queryFilter(this.nftFactory.filters.Transfer('0x0000000000000000000000000000000000000000', address));
        return created.map((log) => {
            return log.args.tokenId;
        });
    }

}