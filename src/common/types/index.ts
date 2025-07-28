// Shared base response interface for both r1fs and cstore
export interface BaseResponse<T = unknown> {
  result: T
  server_node_addr: string
  evm_network: string
  ee_node_alias: string
  ee_node_address: string
  ee_node_eth_address: string
  ee_node_network: string
  ee_node_ver: string
  [key: string]: any
} 