export const Constants = {
  jwt: {
    secret: process.env.JWT_SECRET || 'TYRUINCY#*&#Netyw^',
    expirationDate: '90d'
  },
  transaction: {
    // minimum allowed transfer ammount
    MINIMUM: 100,
    // maximum allowed transfer ammount
    MAXIMUM: 5000000
  },
  exceptions: {
    USERNOTFOUNDEXCEPTION: {
      NAME: "UserNotFoundException",
      MESSAGE: "User not found"
    },
    INSUFFICIENTBALANCEEXCEPTION: {
      NAME: "InsufficientBalanceException",
      MESSAGE: "Insufficient Balance"
    },
    SAMEACCOUNTEXCEPTION: {
      NAME: "SameAccountException",
      MESSAGE: "You cannot send money to yourself"
    },
    USEREXISTSEXCEPTION: {
      NAME: "UserExistsException",
      MESSAGE: "account with this phone number already exist"
    },
    DEFAULT: {
      NAME: "DEFAULT",
      MESSAGE: "We are having issues, Please bear with us as we fix it. Thank you"
    }
  }
}