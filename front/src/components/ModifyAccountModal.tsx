import {Dialog, Transition} from '@headlessui/react'
import {Fragment, useContext} from 'react'
import {ITastefulData, IUserData, TastefulData} from "../context";
import {providers} from "ethers";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

export default function ModifyAccountModal({isOpen, setIsOpen}: { isOpen: boolean, setIsOpen: Function }) {
    const web3Context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = web3Context;
    const tastefulContext = useContext(TastefulData);
    const {tenders, nftsData, userNfts, userData} = tastefulContext;

    let newUserData: IUserData = {
        _id: userData._id,
        address: userData.address,
        bio: userData.bio,
        instagram: userData.instagram,
        profilePic: userData.profilePic,
        pseudo: userData.pseudo,
        twitter: userData.twitter
    };

    async function updateAndSign() {
        if (connector === undefined) return;
        const web3Provider = new providers.Web3Provider(await connector.getProvider());
        const signer = web3Provider.getSigner();
        const signature = await signer.signMessage(JSON.stringify(newUserData));

        fetch(`http://localhost:4000/user/update/${tastefulContext.userData.address}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userData: newUserData,
                signature: signature
            })
        }).then((res) => {
            return res.json().then((res) => {
                tastefulContext.userData = res;
                tastefulContext.setTastefulData({
                    ...tastefulContext
                });
            });
        });
    }

    function closeModal() {
        setIsOpen(false)
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0"/>
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
              &#8203;
            </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div
                                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Update your account
                                </Dialog.Title>
                                <div className="mt-2">
                                    <label className="text-small font-bold mb-2">
                                        Pseudo
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text" defaultValue={newUserData.pseudo} onChange={e => {
                                        newUserData.pseudo = e.target.value
                                    }} placeholder="Pseudo"/>
                                    <label className="text-small font-bold mb-2">
                                        Profile picture
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text" defaultValue={newUserData.profilePic} onChange={e => {
                                        newUserData.profilePic = e.target.value
                                    }} placeholder="Link to a profile picture"/>
                                    <label className="text-small font-bold mb-2">
                                        Twitter name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text" defaultValue={newUserData.twitter} onChange={e => {
                                        newUserData.twitter = e.target.value
                                    }} placeholder="Twitter name"/>
                                    <label className="text-small font-bold mb-2">
                                        Instagram name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text" defaultValue={newUserData.instagram} onChange={e => {
                                        newUserData.instagram = e.target.value
                                    }} placeholder="Instagram name"/>
                                    <label className="text-small font-bold mb-2">
                                        BIO
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                        rows={4} onChange={e => {
                                        newUserData.bio = e.target.value
                                    }}>{newUserData.bio}</textarea>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={updateAndSign}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}