#U-Blox UART baudrate
!UBX CFG-PRT 1 0 0 2240 38400 3 3 0 0

#U-Blox rate in ms
!UBX CFG-RATE 200 1 1 

#NAV5  airborne <4g
!UBX CFG-NAV5 1 8 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0

# turn on UBX RXM-RAWX messages on USB
!UBX CFG-MSG 2 21 0 0 0 1 0 0
# turn on UBX RXM-SFRBX messages on USB
!UBX CFG-MSG 2 19 0 0 0 1 0 0


# turn on UBX NAV-POSLLH on UART1
!UBX CFG-MSG 1 2 0 1 0 0 0 0
# turn on UBX NAV-SOL on UART1
!UBX CFG-MSG 1 6 0 1 0 0 0 0
# turn on UBX NAV-STATUS on UART1 
!UBX CFG-MSG 1 3 0 1 0 0 0 0
# turn on UBX NAV-VELNED on UART1
!UBX CFG-MSG 1 18 0 1 0 0 0 0


# turn off extra messages default messages
# NMEA GGA
!UBX CFG-MSG 240 0 0 0 0 0 0 0
# NMEA GLL
!UBX CFG-MSG 240 1 0 0 0 0 0 0
# NMEA GSA
!UBX CFG-MSG 240 2 0 0 0 0 0 0
# NMEA GSV
!UBX CFG-MSG 240 3 0 0 0 0 0 0
# NMEA RMC
!UBX CFG-MSG 240 4 0 0 0 0 0 0
# NMEA VTG
!UBX CFG-MSG 240 5 0 0 0 0 0 0
# NMEA ZDA
!UBX CFG-MSG 240 8 0 0 0 0 0 0

