import {Constants} from '../../constants'

export function UserNotFoundException(){
    this.message = Constants.exceptions.USERNOTFOUNDEXCEPTION.MESSAGE;
    this.name = Constants.exceptions.USERNOTFOUNDEXCEPTION.NAME;
}

export function InsufficientBalanceException(){
    this.message = Constants.exceptions.INSUFFICIENTBALANCEEXCEPTION.MESSAGE;
    this.name = Constants.exceptions.INSUFFICIENTBALANCEEXCEPTION.NAME;
}

export function SameAccountException(){
    this.message = Constants.exceptions.SAMEACCOUNTEXCEPTION.MESSAGE;
    this.name = Constants.exceptions.SAMEACCOUNTEXCEPTION.NAME;
}

export function UserExistsException(){
    this.message = Constants.exceptions.USEREXISTSEXCEPTION.MESSAGE;
    this.name =  Constants.exceptions.USEREXISTSEXCEPTION.NAME;
}
