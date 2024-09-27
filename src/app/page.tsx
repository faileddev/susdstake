'use client'

import Image from "next/image";
import Logo from "../../components/SOS.png"
import styles from "./page.module.css";
import { chain, client } from "../../utils/constants";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import Link from "next/link";
import Login from "../../components/login";
import { useState } from "react";
import VaultData from "../../components/vaultData";
import VaultOne from "../../components/vaultOne";

export default function Home() {
  const account = useActiveAccount();


  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div>
      <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      >
       
            
            
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "100%",
            
            
            
          }}>
            <Image style={{height: "50px", width: "100px"}}
                  src={Logo}
                  alt='logo'/>
              
          
          <div style={{
                display: "flex",
                flexDirection: "row",
                padding: "10px",
                justifyContent: "space-between",
                minWidth: "100%",
                
          
          }}>
          
          
              <div style={{ margin: "5px"}}>
                <Login />
              </div>
              <div>
                <button
                style={{
                  margin: "5px",
                          padding: "13px",
                          background: "0",
                          border: "solid",
                          borderRadius: "6px",
                          color: "#FFFFFF",
                          fontSize: "1rem",
                          cursor: "pointer",}}
                          onClick={() => setOpenMenu(true)
                }>Menu</button>
              </div>
          </div>
       

{openMenu && (
                    <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "black",
                        display: "flex",
                        justifyContent: "center",
                        
                        
                    }}>
                      
                      
                        <div style={{
                            position: "absolute",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "40px",
                            borderRadius: "10px",
                            minWidth: "300px",
                        }}>
                            <button style={{
                                margin: "50px",
                                padding: "10px",
                                background: "0",
                                border: "solid",
                                borderRadius: "6px",
                                color: "#FFFFFF",
                                fontSize: "1rem",
                                cursor: "pointer",}}
                            onClick={() => setOpenMenu(false)}
                            >
                                X
                            </button>
                            <h1 style={{
                              margin: "10px"
                            }}>
                                Menu
                            </h1>
                            
                              <Link style={{marginTop: "10px", }} href={"https://stake.stacksofsats.com/"}>
                                  Stake
                              </Link>
                              <Link  style={{marginTop: "10px" }} href={"https://susd.stacksofsats.com/"}>
                                  sUSD
                              </Link>
                              <Link style={{marginTop: "10px", }} href={"https://newvaults.stacksofsats.com/"}>
                                  sVaults V2
                              </Link>
                              <Link style={{marginTop: "10px", }} href={"https://svaults.stacksofsats.com/"}>
                                  sVaults V1
                              </Link>

                            

                        </div>
                    </div>
                )}

        </div>
        </div>
        <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          padding: "20px",
          height: "100%",
          marginBottom: "40px"
        }}>
      
      
      
      
      
          <div>
      
      
            <div style={{
              padding: "10px",
              textAlign:"start",
              maxWidth: "50vh"
      
            }}>
              <h1>
            sUSD Staking
          </h1>
                    <p style={{
                      marginTop: "10px"
                    }}>
              sUSD is a decentralised, scalable and overcollateralized stablecoin that is 1:1 USD pegged. 
              Deposit your sUSD into the staking vault to earn rewards in SOS tokens.
                    </p>
            </div>

            
      
            <div style={{
              marginTop: "10px",
              marginBottom: "20px"
            }}>
              <VaultData />
              
            </div>
      
      <div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            
            
            
            
        }}>
            {account ? (
                <div style={{ textAlign: "center"}}>
                

            <VaultOne />
            
           
    </div>
            ) : (
                <div style={{backgroundColor: "#151515", padding: "20px", textAlign: "center", borderRadius: "10px",
                  marginTop: "40px",}}>
                <h1 style={{marginBottom: "20px"}}> Connect A Wallet </h1>
                <ConnectButton 
                client={client}
                chain={chain}/>
            </div>
            )}
            
        </div>
            </div>
          </div>
        </div>
      
    </div>
  );
}
