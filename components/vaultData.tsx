import { useActiveAccount, useReadContract } from "thirdweb/react";
import { STAKE_CONTRACT, VAULT_CONTRACT  } from "../utils/constants";
import { balanceOf } from "thirdweb/extensions/erc20";
import { toEther } from "thirdweb";



const VaultData: React.FC = () => {
   
    const account = useActiveAccount();

    const vaultContract = "0x56bB3b9885ea2e240F6fa36C8d211E91aD83FF3B";
    const stakeContract = "0x71D4E9c491C999AE19Fd0174248804B975CeDd19";


    const { data: vaultTotalSupply, isLoading: loadingVaultTotalSupply} = useReadContract ({
        contract: VAULT_CONTRACT,
        method: "totalSupply"
    });

 

    const { data: spUsdtBalance, isLoading: loadingSpUsdtBalance} = useReadContract (
        balanceOf,
        {
            contract: STAKE_CONTRACT,
            address: account?.address || "",
            queryOptions: {
                enabled: !!account
            }
       
    });

    const { data: vaultReserve, isLoading: loadingVaultReserve} = useReadContract (
        balanceOf,
        {
            contract: STAKE_CONTRACT,
            address: vaultContract,
            queryOptions: {
                enabled: !!account
            }
       
    });



    const { 
        data: totalDeposit, 
        isLoading: loadingTotalDeposit,
        refetch: refetchTotalDeposit,
    } = useReadContract (
        balanceOf,
        {
            contract: VAULT_CONTRACT,
            address: stakeContract,
            
       
    });

    function truncate(vaule: string | number, decimalPlaces: number): number {
        const numericValue: number = Number(vaule);
        if (isNaN(numericValue)) {
            throw new Error('Invalid input: value must be convertible to a number');
        }
        const factor: number = Math.pow(10,decimalPlaces);
        return Math.trunc(numericValue*factor) / factor
    }
    
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            
            
            
        }}>
            <div style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                  
            }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  textAlign:"center",
                  borderRadius: "10px",
                  borderColor: "gray",
                  border: "solid",
                  marginTop: "20px",
                }}
                  >
                    <p>sUSD Price</p>
                    <h3>$0.99</h3>
                </div>
                
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  textAlign:"center",
                  borderRadius: "10px",
                  borderColor: "gray",
                  border: "solid",
                  marginTop: "20px",
                }}
                  >
                    <p>Total Supply</p>
                    {loadingVaultTotalSupply ? (
                
                <p>...</p>
            
                
            ) : (
                
                <h3>{truncate(toEther(vaultTotalSupply!),2).toLocaleString() }<span style={{fontSize: "8px"}}>sUSD</span></h3>
                
            )}


                    </div>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  textAlign:"center",
                  borderRadius: "10px",
                  borderColor: "gray",
                  border: "solid",
                  marginTop: "20px",
                }}
                  >
                    <p>Total sUSD Staked</p>
                    {loadingTotalDeposit ? (
                
                <p>...</p>
            
                
            ) : (
                
                <h3>{truncate(toEther(totalDeposit!),2).toLocaleString() }<span style={{fontSize: "8px"}}>sUSD</span></h3>
                
            )}
                    
                </div>

                

                
                
            </div>
        </div>
        
    )
};

export default VaultData;