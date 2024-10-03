'use client'


import { useState } from "react";
import { approve, balanceOf } from "thirdweb/extensions/erc20";
import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { VAULT_CONTRACT, STAKE_CONTRACT } from "../utils/constants";
import { prepareContractCall, toEther, toWei } from "thirdweb";
import { addEvent } from "thirdweb/extensions/farcaster/keyRegistry";


const VaultOne: React.FC = () => {

    const account = useActiveAccount();

    

    const [mintAmount, setMintAmount] = useState(100);
    const [redeemAmount, setRedeemAmount] = useState(0);
    const [mintingState, setMintingState] = useState<"init" | "approved">("init");
    const [isMinting, setIsMinting] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);

    const { 
        data: stakedBalance, 
        isLoading: loadingStakedBalance,
        refetch: refetchStakedBalance,
    } = useReadContract (
        
        {
            contract: STAKE_CONTRACT,
            method: "stakers",
            params: [account?.address || ""],
            queryOptions: {
                enabled: !!account
            }
       
    });
    

    const { 
        data: susdBalance, 
        isLoading: loadingSusdBalance,
        refetch: refetchSusdBalance
    } = useReadContract (
        balanceOf,
        {
            contract: VAULT_CONTRACT,
            address: account?.address || "",
            queryOptions: {
                enabled: !!account
            }
       
    });

    const { 
        data: pendingRewards, 
        isLoading: loadingPendingRewards,
        refetch: refetchPendingReward,
    } = useReadContract (
        
        {
            contract: STAKE_CONTRACT,
            method: "calculateRewards",
            params: [account?.address || ""],
            queryOptions: {
                enabled: !!account
            }
       
    });

    const { 
        data: unclaimedReward, 
        isLoading: loadingUnclaimedReward,
        refetch: refetchUnclaimedReward,
    } = useReadContract (
        
        {
            contract: STAKE_CONTRACT,
            method: "stakers",
            params: [account?.address || ""],
            queryOptions: {
                enabled: !!account
            }
       
    });

    const { 
        data: stakeTimeStamp, 
        isLoading: loadingStakeTimeStamp,
        refetch: reftchStakeTimeStamp,
    } = useReadContract (
        
        {
            contract: STAKE_CONTRACT,
            method: "stakers",
            params: [account?.address || ""],
            queryOptions: {
                enabled: !!account
            }
       
    });

    const { 
        data: lastClaim, 
        
        refetch: reftchLastClaim,
    } = useReadContract (
        
        {
            contract: STAKE_CONTRACT,
            method: "stakers",
            params: [account?.address || ""],
            queryOptions: {
                enabled: !!account
            }
       
    });

    const { 
        data: lockPeriod, 
        
        refetch: reftchLockPeriod,
    } = useReadContract (
        
        {
            contract: STAKE_CONTRACT,
            method: "lockPeriod",
            queryOptions: {
                enabled: !!account
            }
       
    });

    const currentTime = Math.floor(Date.now() / 1000);  // Current time in seconds
const unlockTime = stakeTimeStamp ? Number(stakeTimeStamp[3]) + 604800 : 0;  // Unlock time in seconds (7 days after stake)

// Check if the unlock time has been reached
const isUnlockDateReached = currentTime >= unlockTime;

    
    

    function truncate(vaule: string | number, decimalPlaces: number): number {
        const numericValue: number = Number(vaule);
        if (isNaN(numericValue)) {
            throw new Error('Invalid input: value must be convertible to a number');
        }
        const factor: number = Math.pow(10,decimalPlaces);
        return Math.trunc(numericValue*factor) / factor
    }
    
    function formatDuration(seconds: number) {
        const days = Math.floor(seconds / (24 * 3600));
        
    
        return `${days} day(s)`;
    }

    return (
<div>
            
                <div 
                style={{
                    backgroundColor: "#151515",
                    padding: "20px",
                    borderRadius: "10px",
                    textAlign: "left",
                    marginTop: "40px",
                    
                    
                }}>
                    <div style={{display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <div>
                            <h1>Entry Vault</h1>
                            <p style={{marginTop: "2px"}}>1 sUSD = 0.01<span style={{fontSize: "10px"}}>SOS</span> Daily </p>
                        </div>

                        <div style={{textAlign: "right"}}>
                            
                            
                            <h1>{lockPeriod ?
                                formatDuration(Number(lockPeriod))  // Convert and format the duration
                                :
                                'Not Staked'
                            } </h1>
                            <p> Lock Period</p>
                        </div>
                    </div>
                    
                    
                    
                    
                    
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignContent: "left",
                        alignItems: "left",
                        marginTop: "40px",
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end",
                            alignItems: "start"
                        }}>
                            <p>
                               Available Balance:
                        </p>
                        
                        {loadingSusdBalance ? (
          <h1>...<span style={{
            fontSize: "12px"
        }}>sUSD</span></h1>
         ) : (
          <h1>{truncate(toEther(susdBalance!),2).toLocaleString() }<span style={{
            fontSize: "12px"
        }}>sUSD</span></h1>
         )} 
         <p style={{
                                marginTop: "20px"
                            }}>
                                Deposited Balance:
                            </p>
                            <h1>
            {stakedBalance ? 
                truncate(toEther(stakedBalance[0] * BigInt(1)).toString(), 2).toLocaleString() 
                : 
                '0.00'
            }
            <span style={{ fontSize: "8px" }}>sUSD</span>
        </h1>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                            <button style={{
                    marginTop: "5px",
                    marginBottom: "5px",
                    padding: "10px",
                    backgroundColor: "#efefef",
                    border: "none",
                    borderRadius: "6px",
                    color: "#333",
                    fontSize: "1rem",
                    cursor: "pointer",}}
                    onClick={() => setIsMinting(true)}
                    
                    >

                                Deposit sUSD
                            </button>
                            <button style={{
                    marginTop: "5px",
                    marginBottom: "5px",
                    padding: "10px",
                    backgroundColor: "#efefef",
                    border: "none",
                    borderRadius: "6px",
                    color: "#333",
                    fontSize: "1rem",
                    cursor: "pointer",}}
                    
                    onClick={() => setIsRedeeming(true)}
                    >
                                Withdraw sUSD
                            </button>
                            
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "20px",
                        }}>
                        
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left"
                        }} >
                            <p style={{marginTop: "10px"}}>Unclaimed Rewards:</p>
                            
                            <h1>
                            {unclaimedReward ? 
                                truncate(toEther((unclaimedReward[2] + (pendingRewards!) )  * BigInt(1)).toString(), 2).toLocaleString() 
                                : 
                                '0.00'
                            } 
                            <span style={{ fontSize: "8px" }}>SOS</span>
                            </h1>
                        </div>
                        
                        </div>
                        <TransactionButton style={{
                                        
                                        marginTop: "10px"
                                    }}
                                        transaction={() => (
                                            prepareContractCall({
                                                contract: STAKE_CONTRACT,
                                                method: "claim",
                                            })
                                        )}
                                        onTransactionConfirmed={() => {
                                            refetchPendingReward();
                                            refetchUnclaimedReward();
                                            reftchLastClaim();
                                        }}
                                    >
                                        Claim Reward
                                    </TransactionButton>
                        
                    
                        {isMinting && (
                    <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "10px"
                        
                    }}>
                        <div style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            textAlign: "left",
                            backgroundColor: "#151515",
                            margin: "20px",
                            padding: "40px",
                            borderRadius: "10px",
                            maxWidth: "500px",
                        }}>
                            
                            <h1>
                                Deposit sUSD
                            </h1>
                            <p style={{
                                marginTop: "10px"
                            }}>
                            Stake your sUSD to earn rewards. sUSD deposited into this vault is locked for 7 days. Once a deposit is made you have to wait 7 days before you can initiate a withdrawal.
                            </p>
                            
                            

                            <p style={{
                                marginTop: "20px"
                            }}>
                                Available Balance:
                            </p>
                            <h1>
                                {truncate(toEther(susdBalance!),2).toLocaleString() }<span style={{
                                    fontSize: "10px"
                                }}>sUSD</span>
                            </h1>

                            <p style={{
                                marginTop: "20px"
                            }}>
                                Deposited Balance:
                            </p>
                            <h1>
            {stakedBalance ? 
                truncate(toEther(stakedBalance[0] * BigInt(1)).toString(), 2).toLocaleString() 
                : 
                '0.00'
            }
            <span style={{ fontSize: "8px" }}>sUSD</span>
        </h1>

        
                            
                            {mintingState === "init" ? (
                                <>
                                <p style={{
                                    marginTop: "10px"
                                }}>Deposit</p>
                                <input
                                type="number"
                                placeholder="100"
                                value={mintAmount}
                                onChange={(e) => setMintAmount(Number(e.target.value))}
                                style={{
                                    marginTop: "2px",
                                    padding: "5px",
                                    borderRadius: "5px",
                                    border: "1px solid #333",
                                    width: "100%",
                                    height: "40px",
                                    fontSize: "18px"
                                }}
                                
                                
                                />
                                <div style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            marginTop: "10px",
                            justifyContent: "space-between",
                        }}>

                            
                        
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left"
                            
                        }} >
                            <p style={{marginTop: "10px"}}>Minimum Deposit:</p>
                            
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "right"
                            
                        }} >
                            <p style={{marginTop: "10px"}}>1,000<span style={{ fontSize: "8px" }}>sUSD</span></p>
                            
                        </div>
                        
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                        }}>

                            
                        
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left"
                            
                        }} >
                            <p style={{marginTop: "10px"}}>Maximum Deposit:</p>
                            
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "right"
                            
                        }} >
                            <p style={{marginTop: "10px"}}>1,000,000<span style={{ fontSize: "8px" }}>sUSD</span></p>
                            
                        </div>
                        
                        </div>



                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                        }}>

                            
                        
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left"
                            
                        }} >
                            <p style={{marginTop: "10px"}}>Unclaimed Rewards:</p>
                            
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "right"
                            
                        }} >
                            <p style={{marginTop: "10px"}}>{unclaimedReward ? 
                                truncate(toEther((unclaimedReward[2] + (pendingRewards!) )  * BigInt(1)).toString(), 2).toLocaleString() 
                                : 
                                '0.00'
                            } 
                            <span style={{ fontSize: "8px" }}>SOS</span></p>
                            
                        </div>
                        
                        </div>





                                <TransactionButton
                                transaction={() => (
                                    approve ({
                                        contract: VAULT_CONTRACT,
                                        spender: STAKE_CONTRACT.address,
                                        amount: mintAmount,
                                    })
                                )}
                                onTransactionConfirmed={() => (
                                    setMintingState("approved")
                                )}
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                }}
                                >Set Approval</TransactionButton>
                                </>

                            ) : (
                                <>
                                <p style={{marginTop: "10px"}}>Deposit</p>
                                <h1 style={{ marginTop: "5px"}}>{mintAmount}<span style={{fontSize: "12px"}}>sUSD</span></h1>
                                
         
         
                                <TransactionButton style={{width:"100%", marginTop:"10px",}}
                                 transaction={() => (
                                    prepareContractCall({
                                        contract: STAKE_CONTRACT,
                                        method: "stake",
                                        params: [toWei(mintAmount.toString())],
                                    })
                                 )}
                                 onTransactionConfirmed={() => {
                                    setMintAmount(100);
                                    setMintingState("init");
                                    refetchSusdBalance;
                                    refetchStakedBalance;
                                    setIsMinting(false);
                                 }}
                                >
                                    Deposit sUSD
                                </TransactionButton>
                                

                                
                                </>
                                
                            ) } 
                            <button style={{
                                marginTop: "5px",
                                marginBottom: "5px",
                                padding: "10px",
                                backgroundColor: "#efefef",
                                border: "none",
                                borderRadius: "6px",
                                color: "#333",
                                fontSize: "1rem",
                                cursor: "pointer",
                                width: "100%",
                                height: "42px"
                                }}
                                onClick={() => setIsMinting(false)}
                    
                                    >

                                    Close
                                    </button>
                            
                            
                        </div>
                    </div>
                )}

{isRedeeming && (
                    <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        
                    }}>
                        <div style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            textAlign: "left",
                            backgroundColor: "#151515",
                            padding: "40px",
                            margin: "20px",
                            borderRadius: "10px",
                            maxWidth: "500px",
                        }}>
                            
                            <h1>
                                Withdraw sUSD
                            </h1>
                            <p style={{marginTop: "10px"}}>
                            sUSD deposited into this vault is locked for 7 days. Once a deposit is made you have to wait 7 days before you can initiate a withdrawal.
                            </p>
                            
                            

                            <p style={{
                                marginTop: "20px"
                            }}>
                                Deposited Balance:
                            </p>
                            <h1>
            {stakedBalance ? 
                truncate(toEther(stakedBalance[0] * BigInt(1)).toString(), 2).toLocaleString() 
                : 
                '0.00'
            }
            <span style={{ fontSize: "8px" }}>sUSD</span>
        </h1>

                           
                            
                            <p style={{ marginTop: "20px"}}>Enter Amount To Withdraw: </p>
                            <input
                             type="number"
                             placeholder="100"
                             value={redeemAmount}
                             onChange={(e) => setRedeemAmount(Number(e.target.value))}
                             style={{
                                marginTop: "10px",
                                padding: "5px",
                                borderRadius: "5px",
                                border: "1px solid #333",
                                width: "100%",
                                height: "40px",
                                fontSize: "18px"
                            }}
                             />
                            
                            
                            <div style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            marginTop: "10px",
                            justifyContent: "space-between",
                        }}>

                            
                        
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left"
                            
                        }} >
                            <p style={{marginTop: "10px"}}>Lock Date:</p>
                            
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "right"
                            
                        }} >
                            <p style={{marginTop: "10px"}}>
    {stakeTimeStamp ? 
new Date(Number(stakeTimeStamp[3]) * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
})
        : 
        'Not Staked'
    }
 </p>
                            
                        </div>
                        
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                        }}>

                            
                        
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left"
                            
                        }} >
                            <p style={{marginTop: "5px"}}>Unlock Date:</p>
                            
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "right"
                            
                        }} >
                            <p style={{marginTop: "5px"}}>
                            
    {stakeTimeStamp ? 
        new Date((Number(stakeTimeStamp[3]) + 604800) * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
})  // Add 7 days in seconds and format
        : 
        'Not Staked'
    }

 </p>
                            
                        </div>
                        
                        </div>


                        
                        

                        


                            
                            <div style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                        }}>

                            
                        
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left"
                            
                        }} >
                            <p style={{marginTop: "5px"}}>Unclaimed Rewards:</p>
                            
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "right"
                            
                        }} >
                            <p style={{marginTop: "5px"}}>{unclaimedReward ? 
                                truncate(toEther((unclaimedReward[2] + (pendingRewards!) )  * BigInt(1)).toString(), 2).toLocaleString() 
                                : 
                                '0.00'
                            } 
                            <span style={{ fontSize: "8px" }}>SOS</span></p>
                            
                        </div>

                        
                        
                        
                        </div>


                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                        }}>

                            
                        
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left"
                            
                        }} >
                            <p style={{marginTop: "5px"}}>Emergency Withdrawal Fee:</p>
                            
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "right"
                            
                        }} >
                            <p style={{marginTop: "5px"}}>
                            
    50%

 </p>
                            
                        </div>
                        
                        </div>

                        <TransactionButton style={{
                                        
                                        marginTop: "10px",
                                        width: "100%",
                                    }}
                                        transaction={() => (
                                            prepareContractCall({
                                                contract: STAKE_CONTRACT,
                                                method: "claim",
                                            })
                                        )}
                                        onTransactionConfirmed={() => {
                                            refetchPendingReward();
                                            refetchUnclaimedReward();
                                            reftchLastClaim();
                                        }}
                                    >
                                        Claim Reward
                                    </TransactionButton>
                             
                            <TransactionButton style={{marginTop: "5px", width: "100%"}}
                            transaction={() => (
                                prepareContractCall({
                                    contract: STAKE_CONTRACT,
                                    method: "unstake",
                                    params: [toWei(redeemAmount.toString())] 
                                })
                            )}
                            onTransactionConfirmed={() => {
                                setRedeemAmount(0);
                                refetchSusdBalance;
                                refetchStakedBalance;
                                setIsRedeeming(false);
                            }}
                            disabled={!isUnlockDateReached}
                            >
                                Withdraw sUSD
                            </TransactionButton>

                            



                            
                            <TransactionButton style={{marginTop: "5px", width: "100%",
                                        backgroundColor: "red",
                                        color: "white",}}
                            transaction={() => (
                                prepareContractCall({
                                    contract: STAKE_CONTRACT,
                                    method: "earlyWithdraw",
                                    params: [toWei(redeemAmount.toString())] 
                                })
                            )}
                            onTransactionConfirmed={() => {
                                setRedeemAmount(0);
                                refetchSusdBalance;
                                refetchStakedBalance;
                                setIsRedeeming(false);
                            }}
                            disabled={isUnlockDateReached}
                            >
                                Emergency Withdrawal
                            </TransactionButton>
                            <button style={{
                                marginTop: "5px",
                                marginBottom: "5px",
                                padding: "10px",
                                backgroundColor: "#efefef",
                                border: "none",
                                borderRadius: "6px",
                                color: "#333",
                                fontSize: "1rem",
                                cursor: "pointer",
                                width: "100%",
                                height: "42px"
                                }}
                                onClick={() => setIsRedeeming(false)}
                    
                                    >

                                    Close
                            </button>
                        </div>
                    </div>
                )}

                        
                    </div>
                    </div>
                    </div>
                    )
                    };
                    export default VaultOne;
                    
