/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  CourseMarket,
  CourseMarketInterface,
} from "../../contracts/CourseMarket";

const _abi = [
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_mmcToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "web2CourseId",
        type: "string",
      },
    ],
    name: "CoursePurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "web2CourseId",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "addCourse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "courseCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "courses",
    outputs: [
      {
        internalType: "string",
        name: "web2CourseId",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "page",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pageSize",
        type: "uint256",
      },
    ],
    name: "getCoursesByPage",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "web2CourseId",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct CourseMarket.Course[]",
        name: "",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserPurchasedCourses",
    outputs: [
      {
        internalType: "uint256[]",
        name: "courseIds",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "string",
            name: "web2CourseId",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct CourseMarket.Course[]",
        name: "courseDetails",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "string",
        name: "web2CourseId",
        type: "string",
      },
    ],
    name: "hasCourse",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mmcToken",
    outputs: [
      {
        internalType: "contract MMCToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "web2CourseId",
        type: "string",
      },
    ],
    name: "purchaseCourse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "updateCoursePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    name: "updateCourseStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userCourses",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "web2ToCourseId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051612e45380380612e4583398181016040528101906100329190610223565b33600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100a55760006040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161009c9190610271565b60405180910390fd5b6100b4816100fc60201b60201c565b5080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505061028c565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101f0826101c5565b9050919050565b610200816101e5565b811461020b57600080fd5b50565b60008151905061021d816101f7565b92915050565b600060208284031215610239576102386101c0565b5b60006102478482850161020e565b91505092915050565b600061025b826101c5565b9050919050565b61026b81610250565b82525050565b60006020820190506102866000830184610262565b92915050565b612baa8061029b6000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c8063715018a6116100975780639b84006e116100665780639b84006e14610263578063dd403ce114610293578063f060daf9146102c3578063f2fde38b146102f4576100f5565b8063715018a6146101d75780638da5cb5b146101e157806393a05c20146101ff57806396f979d21461022f576100f5565b80634cea127b116100d35780634cea127b146101505780635899f5831461016c578063660551591461019d57806367589b6f146101bb576100f5565b80633d54353a146100fa57806344a8ef191461011857806347a5f01514610134575b600080fd5b610102610310565b60405161010f91906118bd565b60405180910390f35b610132600480360381019061012d9190611a68565b610336565b005b61014e60048036038101906101499190611af3565b6105a1565b005b61016a60048036038101906101659190611b6b565b61065c565b005b61018660048036038101906101819190611be9565b6106e7565b604051610194929190611eb0565b60405180910390f35b6101a5610abb565b6040516101b29190611ef6565b60405180910390f35b6101d560048036038101906101d09190611f11565b610ac1565b005b6101df611002565b005b6101e9611016565b6040516101f69190611f69565b60405180910390f35b61021960048036038101906102149190611f84565b61103f565b6040516102269190611fd3565b60405180910390f35b61024960048036038101906102449190611fee565b61106e565b60405161025a959493929190612065565b60405180910390f35b61027d60048036038101906102789190611f11565b6111e1565b60405161028a9190611ef6565b60405180910390f35b6102ad60048036038101906102a891906120c6565b61120f565b6040516102ba9190611fd3565b60405180910390f35b6102dd60048036038101906102d89190611af3565b6112dd565b6040516102eb929190612122565b60405180910390f35b61030e60048036038101906103099190611be9565b61161e565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b61033e6116a4565b60008111610381576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103789061219e565b60405180910390fd5b60008251116103c5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103bc9061220a565b60405180910390fd5b6000835111610409576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161040090612276565b60405180910390fd5b600060038460405161041b91906122d2565b9081526020016040518091039020541461046a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161046190612335565b60405180910390fd5b6005600081548092919061047d90612384565b91905055506040518060a001604052808481526020018381526020018281526020016001151581526020013373ffffffffffffffffffffffffffffffffffffffff1681525060026000600554815260200190815260200160002060008201518160000190816104ec91906125ce565b50602082015181600101908161050291906125ce565b506040820151816002015560608201518160030160006101000a81548160ff02191690831515021790555060808201518160030160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555090505060055460038460405161058a91906122d2565b908152602001604051809103902081905550505050565b6105a96116a4565b6000821180156105bb57506005548211155b6105fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105f1906126ec565b60405180910390fd5b6000811161063d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106349061219e565b60405180910390fd5b8060026000848152602001908152602001600020600201819055505050565b6106646116a4565b60008211801561067657506005548211155b6106b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106ac906126ec565b60405180910390fd5b806002600084815260200190815260200160002060030160006101000a81548160ff0219169083151502179055505050565b606080600080600190505b600554811161078057600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082815260200190815260200160002060009054906101000a900460ff161561076d57818061076990612384565b9250505b808061077890612384565b9150506106f2565b508067ffffffffffffffff81111561079b5761079a611907565b5b6040519080825280602002602001820160405280156107c95781602001602082028036833780820191505090505b5092508067ffffffffffffffff8111156107e6576107e5611907565b5b60405190808252806020026020018201604052801561081f57816020015b61080c6117f7565b8152602001906001900390816108045790505b509150600080600190505b6005548111610ab357600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082815260200190815260200160002060009054906101000a900460ff1615610aa057808583815181106108aa576108a961270c565b5b602002602001018181525050600260008281526020019081526020016000206040518060a00160405290816000820180546108e4906123fb565b80601f0160208091040260200160405190810160405280929190818152602001828054610910906123fb565b801561095d5780601f106109325761010080835404028352916020019161095d565b820191906000526020600020905b81548152906001019060200180831161094057829003601f168201915b50505050508152602001600182018054610976906123fb565b80601f01602080910402602001604051908101604052809291908181526020018280546109a2906123fb565b80156109ef5780601f106109c4576101008083540402835291602001916109ef565b820191906000526020600020905b8154815290600101906020018083116109d257829003601f168201915b50505050508152602001600282015481526020016003820160009054906101000a900460ff161515151581526020016003820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681525050848381518110610a8657610a8561270c565b5b60200260200101819052508180610a9c90612384565b9250505b8080610aab90612384565b91505061082a565b505050915091565b60055481565b6000600382604051610ad391906122d2565b908152602001604051809103902054905060008111610b27576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b1e90612787565b60405180910390fd5b6000600260008381526020019081526020016000206040518060a0016040529081600082018054610b57906123fb565b80601f0160208091040260200160405190810160405280929190818152602001828054610b83906123fb565b8015610bd05780601f10610ba557610100808354040283529160200191610bd0565b820191906000526020600020905b815481529060010190602001808311610bb357829003601f168201915b50505050508152602001600182018054610be9906123fb565b80601f0160208091040260200160405190810160405280929190818152602001828054610c15906123fb565b8015610c625780601f10610c3757610100808354040283529160200191610c62565b820191906000526020600020905b815481529060010190602001808311610c4557829003601f168201915b50505050508152602001600282015481526020016003820160009054906101000a900460ff161515151581526020016003820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152505090508060600151610d2c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d23906127f3565b60405180910390fd5b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002060009054906101000a900460ff1615610dca576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dc19061285f565b60405180910390fd5b82604051602001610ddb91906122d2565b604051602081830303815290604052805190602001208160000151604051602001610e0691906122d2565b6040516020818303038152906040528051906020012014610e5c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e53906128cb565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd33836080015184604001516040518463ffffffff1660e01b8152600401610ec3939291906128eb565b6020604051808303816000875af1158015610ee2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f069190612937565b610f45576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f3c906129b0565b60405180910390fd5b6001600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084815260200190815260200160002060006101000a81548160ff021916908315150217905550813373ffffffffffffffffffffffffffffffffffffffff167f1a04f8d389f43beccf2cc32092c53cb34d57ec70fd68693db2bfe79336db783c85604051610ff591906129d0565b60405180910390a3505050565b61100a6116a4565b611014600061172b565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60046020528160005260406000206020528060005260406000206000915091509054906101000a900460ff1681565b6002602052806000526040600020600091509050806000018054611091906123fb565b80601f01602080910402602001604051908101604052809291908181526020018280546110bd906123fb565b801561110a5780601f106110df5761010080835404028352916020019161110a565b820191906000526020600020905b8154815290600101906020018083116110ed57829003601f168201915b50505050509080600101805461111f906123fb565b80601f016020809104026020016040519081016040528092919081815260200182805461114b906123fb565b80156111985780601f1061116d57610100808354040283529160200191611198565b820191906000526020600020905b81548152906001019060200180831161117b57829003601f168201915b5050505050908060020154908060030160009054906101000a900460ff16908060030160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905085565b6003818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b60008060038360405161122291906122d2565b908152602001604051809103902054905060008111611276576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161126d90612787565b60405180910390fd5b600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082815260200190815260200160002060009054906101000a900460ff1691505092915050565b60606000808311611323576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161131a90612a3e565b60405180910390fd5b600083856113319190612a5e565b9050600554811115611378576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161136f90612aec565b60405180910390fd5b6000849050600554858361138c9190612b0c565b11156113a357816005546113a09190612b40565b90505b60008167ffffffffffffffff8111156113bf576113be611907565b5b6040519080825280602002602001820160405280156113f857816020015b6113e56117f7565b8152602001906001900390816113dd5790505b50905060005b8281101561160b576000600182866114169190612b0c565b6114209190612b0c565b9050600260008281526020019081526020016000206040518060a0016040529081600082018054611450906123fb565b80601f016020809104026020016040519081016040528092919081815260200182805461147c906123fb565b80156114c95780601f1061149e576101008083540402835291602001916114c9565b820191906000526020600020905b8154815290600101906020018083116114ac57829003601f168201915b505050505081526020016001820180546114e2906123fb565b80601f016020809104026020016040519081016040528092919081815260200182805461150e906123fb565b801561155b5780601f106115305761010080835404028352916020019161155b565b820191906000526020600020905b81548152906001019060200180831161153e57829003601f168201915b50505050508152602001600282015481526020016003820160009054906101000a900460ff161515151581526020016003820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815250508383815181106115f2576115f161270c565b5b60200260200101819052505080806001019150506113fe565b5080600554945094505050509250929050565b6116266116a4565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036116985760006040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161168f9190611f69565b60405180910390fd5b6116a18161172b565b50565b6116ac6117ef565b73ffffffffffffffffffffffffffffffffffffffff166116ca611016565b73ffffffffffffffffffffffffffffffffffffffff1614611729576116ed6117ef565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016117209190611f69565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b6040518060a00160405280606081526020016060815260200160008152602001600015158152602001600073ffffffffffffffffffffffffffffffffffffffff1681525090565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600061188361187e6118798461183e565b61185e565b61183e565b9050919050565b600061189582611868565b9050919050565b60006118a78261188a565b9050919050565b6118b78161189c565b82525050565b60006020820190506118d260008301846118ae565b92915050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61193f826118f6565b810181811067ffffffffffffffff8211171561195e5761195d611907565b5b80604052505050565b60006119716118d8565b905061197d8282611936565b919050565b600067ffffffffffffffff82111561199d5761199c611907565b5b6119a6826118f6565b9050602081019050919050565b82818337600083830152505050565b60006119d56119d084611982565b611967565b9050828152602081018484840111156119f1576119f06118f1565b5b6119fc8482856119b3565b509392505050565b600082601f830112611a1957611a186118ec565b5b8135611a298482602086016119c2565b91505092915050565b6000819050919050565b611a4581611a32565b8114611a5057600080fd5b50565b600081359050611a6281611a3c565b92915050565b600080600060608486031215611a8157611a806118e2565b5b600084013567ffffffffffffffff811115611a9f57611a9e6118e7565b5b611aab86828701611a04565b935050602084013567ffffffffffffffff811115611acc57611acb6118e7565b5b611ad886828701611a04565b9250506040611ae986828701611a53565b9150509250925092565b60008060408385031215611b0a57611b096118e2565b5b6000611b1885828601611a53565b9250506020611b2985828601611a53565b9150509250929050565b60008115159050919050565b611b4881611b33565b8114611b5357600080fd5b50565b600081359050611b6581611b3f565b92915050565b60008060408385031215611b8257611b816118e2565b5b6000611b9085828601611a53565b9250506020611ba185828601611b56565b9150509250929050565b6000611bb68261183e565b9050919050565b611bc681611bab565b8114611bd157600080fd5b50565b600081359050611be381611bbd565b92915050565b600060208284031215611bff57611bfe6118e2565b5b6000611c0d84828501611bd4565b91505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611c4b81611a32565b82525050565b6000611c5d8383611c42565b60208301905092915050565b6000602082019050919050565b6000611c8182611c16565b611c8b8185611c21565b9350611c9683611c32565b8060005b83811015611cc7578151611cae8882611c51565b9750611cb983611c69565b925050600181019050611c9a565b5085935050505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611d3a578082015181840152602081019050611d1f565b60008484015250505050565b6000611d5182611d00565b611d5b8185611d0b565b9350611d6b818560208601611d1c565b611d74816118f6565b840191505092915050565b611d8881611b33565b82525050565b611d9781611bab565b82525050565b600060a0830160008301518482036000860152611dba8282611d46565b91505060208301518482036020860152611dd48282611d46565b9150506040830151611de96040860182611c42565b506060830151611dfc6060860182611d7f565b506080830151611e0f6080860182611d8e565b508091505092915050565b6000611e268383611d9d565b905092915050565b6000602082019050919050565b6000611e4682611cd4565b611e508185611cdf565b935083602082028501611e6285611cf0565b8060005b85811015611e9e5784840389528151611e7f8582611e1a565b9450611e8a83611e2e565b925060208a01995050600181019050611e66565b50829750879550505050505092915050565b60006040820190508181036000830152611eca8185611c76565b90508181036020830152611ede8184611e3b565b90509392505050565b611ef081611a32565b82525050565b6000602082019050611f0b6000830184611ee7565b92915050565b600060208284031215611f2757611f266118e2565b5b600082013567ffffffffffffffff811115611f4557611f446118e7565b5b611f5184828501611a04565b91505092915050565b611f6381611bab565b82525050565b6000602082019050611f7e6000830184611f5a565b92915050565b60008060408385031215611f9b57611f9a6118e2565b5b6000611fa985828601611bd4565b9250506020611fba85828601611a53565b9150509250929050565b611fcd81611b33565b82525050565b6000602082019050611fe86000830184611fc4565b92915050565b600060208284031215612004576120036118e2565b5b600061201284828501611a53565b91505092915050565b600082825260208201905092915050565b600061203782611d00565b612041818561201b565b9350612051818560208601611d1c565b61205a816118f6565b840191505092915050565b600060a082019050818103600083015261207f818861202c565b90508181036020830152612093818761202c565b90506120a26040830186611ee7565b6120af6060830185611fc4565b6120bc6080830184611f5a565b9695505050505050565b600080604083850312156120dd576120dc6118e2565b5b60006120eb85828601611bd4565b925050602083013567ffffffffffffffff81111561210c5761210b6118e7565b5b61211885828601611a04565b9150509250929050565b6000604082019050818103600083015261213c8185611e3b565b905061214b6020830184611ee7565b9392505050565b7f5072696365206d7573742062652067726561746572207468616e203000000000600082015250565b6000612188601c8361201b565b915061219382612152565b602082019050919050565b600060208201905081810360008301526121b78161217b565b9050919050565b7f436f75727365206e616d652063616e6e6f7420626520656d7074790000000000600082015250565b60006121f4601b8361201b565b91506121ff826121be565b602082019050919050565b60006020820190508181036000830152612223816121e7565b9050919050565b7f5765623220636f757273652049442063616e6e6f7420626520656d7074790000600082015250565b6000612260601e8361201b565b915061226b8261222a565b602082019050919050565b6000602082019050818103600083015261228f81612253565b9050919050565b600081905092915050565b60006122ac82611d00565b6122b68185612296565b93506122c6818560208601611d1c565b80840191505092915050565b60006122de82846122a1565b915081905092915050565b7f436f7572736520616c7265616479206578697374730000000000000000000000600082015250565b600061231f60158361201b565b915061232a826122e9565b602082019050919050565b6000602082019050818103600083015261234e81612312565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061238f82611a32565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036123c1576123c0612355565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061241357607f821691505b602082108103612426576124256123cc565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261248e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82612451565b6124988683612451565b95508019841693508086168417925050509392505050565b60006124cb6124c66124c184611a32565b61185e565b611a32565b9050919050565b6000819050919050565b6124e5836124b0565b6124f96124f1826124d2565b84845461245e565b825550505050565b600090565b61250e612501565b6125198184846124dc565b505050565b5b8181101561253d57612532600082612506565b60018101905061251f565b5050565b601f821115612582576125538161242c565b61255c84612441565b8101602085101561256b578190505b61257f61257785612441565b83018261251e565b50505b505050565b600082821c905092915050565b60006125a560001984600802612587565b1980831691505092915050565b60006125be8383612594565b9150826002028217905092915050565b6125d782611d00565b67ffffffffffffffff8111156125f0576125ef611907565b5b6125fa82546123fb565b612605828285612541565b600060209050601f8311600181146126385760008415612626578287015190505b61263085826125b2565b865550612698565b601f1984166126468661242c565b60005b8281101561266e57848901518255600182019150602085019450602081019050612649565b8683101561268b5784890151612687601f891682612594565b8355505b6001600288020188555050505b505050505050565b7f496e76616c696420636f75727365204944000000000000000000000000000000600082015250565b60006126d660118361201b565b91506126e1826126a0565b602082019050919050565b60006020820190508181036000830152612705816126c9565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f436f7572736520646f6573206e6f742065786973740000000000000000000000600082015250565b600061277160158361201b565b915061277c8261273b565b602082019050919050565b600060208201905081810360008301526127a081612764565b9050919050565b7f436f75727365206e6f7420616374697665000000000000000000000000000000600082015250565b60006127dd60118361201b565b91506127e8826127a7565b602082019050919050565b6000602082019050818103600083015261280c816127d0565b9050919050565b7f416c726561647920707572636861736564000000000000000000000000000000600082015250565b600061284960118361201b565b915061285482612813565b602082019050919050565b600060208201905081810360008301526128788161283c565b9050919050565b7f436f75727365204944206d69736d617463680000000000000000000000000000600082015250565b60006128b560128361201b565b91506128c08261287f565b602082019050919050565b600060208201905081810360008301526128e4816128a8565b9050919050565b60006060820190506129006000830186611f5a565b61290d6020830185611f5a565b61291a6040830184611ee7565b949350505050565b60008151905061293181611b3f565b92915050565b60006020828403121561294d5761294c6118e2565b5b600061295b84828501612922565b91505092915050565b7f5472616e73666572206661696c65640000000000000000000000000000000000600082015250565b600061299a600f8361201b565b91506129a582612964565b602082019050919050565b600060208201905081810360008301526129c98161298d565b9050919050565b600060208201905081810360008301526129ea818461202c565b905092915050565b7f506167652073697a65206d7573742062652067726561746572207468616e2030600082015250565b6000612a2860208361201b565b9150612a33826129f2565b602082019050919050565b60006020820190508181036000830152612a5781612a1b565b9050919050565b6000612a6982611a32565b9150612a7483611a32565b9250828202612a8281611a32565b91508282048414831517612a9957612a98612355565b5b5092915050565b7f50616765206f7574206f6620626f756e64730000000000000000000000000000600082015250565b6000612ad660128361201b565b9150612ae182612aa0565b602082019050919050565b60006020820190508181036000830152612b0581612ac9565b9050919050565b6000612b1782611a32565b9150612b2283611a32565b9250828201905080821115612b3a57612b39612355565b5b92915050565b6000612b4b82611a32565b9150612b5683611a32565b9250828203905081811115612b6e57612b6d612355565b5b9291505056fea2646970667358221220369a21c5172b4a8bb471248339e59b321d080ae28f463b9a7fdc50e323bfa29664736f6c634300081c0033";

type CourseMarketConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CourseMarketConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CourseMarket__factory extends ContractFactory {
  constructor(...args: CourseMarketConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _mmcToken: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_mmcToken, overrides || {});
  }
  override deploy(
    _mmcToken: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_mmcToken, overrides || {}) as Promise<
      CourseMarket & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): CourseMarket__factory {
    return super.connect(runner) as CourseMarket__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CourseMarketInterface {
    return new Interface(_abi) as CourseMarketInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): CourseMarket {
    return new Contract(address, _abi, runner) as unknown as CourseMarket;
  }
}
