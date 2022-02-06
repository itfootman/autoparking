#modif by yangxp@ 211011
######################################### G3 and VOLVO Identical VEHICLE INFORMATION START ################################################
geometry_msgs/AccelStamped accelStamped     # Velocity acceleration and angular velocity in the x, y and z directions
                                            # systeam timestamp

geometry_msgs/Vector3 linearSpeed           # The velocity in the x, y, and z directions       

float32 FLWheelSpd                          # unit km/h (Fornt left  wheel speed)
float32 FRWheelSpd                          #unit km/h (Fornt right wheel speed)     
float32 RLWheelSpd                          #unit km/h (Rear  left  wheel speed)     
float32 RRWheelSpd                          #unit km/h (Rear  right wheel speed)   

uint8   FLWheelDirection                    # UNDEFINED FORWARD BACKWARD STOP
uint8   FRWheelDirection                    # UNDEFINED FORWARD BACKWARD STOP
uint8   RLWheelDirection                    # UNDEFINED FORWARD BACKWARD STOP
uint8   RRWheelDirection                    # UNDEFINED FORWARD BACKWARD STOP

uint16  FLWheelSpdEdgesSum                  #   count
uint16  FRWheelSpdEdgesSum                  #   count
uint16  RLWheelSpdEdgesSum                  #   count
uint16  RRWheelSpdEdgesSum                  #   count

float32 vehicleSpeed                        #unit km/h   

uint8   gear                                # G3      0x00:Invalid;  0x01:D; 0x02:N; 0x03:R; 0x04:P; 
                                            # VOLVO   0x00:P;        0x01:R; 0x02:N; 0x03:D; 0x04:M; 0x05:Resd1; 0x06:Resd2; 0x07:Undefd

float32 steeringAngleSpd                    #unit degree   right turn is right and left turn is obverse
float32 steeringAngle                       #unit degree/s (-780~+779.9)

#uint8  u8SteeringAngleSpd # raw data

######################################### G3 VEHICLE INFORMATION END ###################################################

######################################### VOLVO VEHICLE INFORMATION START ##############################################
#add by yangxp @20211026
uint8 rosmsg_AD_BTN_Psd                     #AD Mode Button State
                                            #0x00: Unknow; 0x01:Pressed

uint8 rosmsg_AD_Mod_FB                      #AD Mode FeedBack
                                            #0 "ManualDrive"
                                            #1 "AdActv"
                                            #2 "SafeManeuver"
                                            #3 "SafeSt"
                                            #4 "DevMod1"
                                            #5 "DevMod2"
                                            #6 "DevMod3"
                                            #7 "DevMod4"

uint8 rosmsg_Veh_Motion                     #vehicle Motion FeedBack
                                            #0 "Unknow"
                                            #1 "Standstill"
                                            #2 "Standstill"
                                            #3 "Standstill"
                                            #4 "Rolling Fwd"
                                            #5 "Rolling Fwd"
                                            #6 "Rolling Back"
                                            #7 "Rolling Back"

uint8 rosmsg_GasPed_Psd                     #Accelerator Pedal Feedback
                                            #0x00 NO, 0x01 Yes

uint8 rosmsg_ESC_Actv                       #ESC State FeedBack
                                            #0 "EscSt1_Inin"
                                            #1 "EscSt1_Ok"
                                            #2 "EscSt1_TmpErr"
                                            #3 "EscSt1_PrmntErr"
                                            #4 "EscSt1_UsrOff"   

float32 rosmsg_SterWhl_Tq                   #(-30~+30)
uint8   rosmsg_SterWhl_Ovr                  #EPS torque feedback  

uint8   rosmsg_Chk_EPB                      #EPB State Det
                                            #0 "On"
                                            #1 "Off"
                                            #2 "Check EPB(Flash2)"
                                            #3 "Check EPB(Flash3)"

uint8 rosmsg_Chk_ESP                        #ESP State Det
                                            #0 "AbsWarnIndReq_AbsWarnIndOnReq"
                                            #1 "AbsWarnIndReq_AbsWarnIndFlsgReq"
                                            #2 "AbsWarnIndReq_Resd2"
                                            #3 "AbsWarnIndReq_AbsWarnIndOffReq"

uint8 rosmsg_Brk_Ped_Psd                    #Brake Pedal State
                                            #0x00:NO, 0x01:Yes

######################################### VOLVO VEHICLE INFORMATION END ################################################

geometry_msgs/Vector3  APACarPar

uint64  timestamp
