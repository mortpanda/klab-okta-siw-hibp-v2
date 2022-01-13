import { Injectable } from '@angular/core';
import { OktaAuth } from "@okta/okta-auth-js";

@Injectable({
  providedIn: 'root'
})
export class OktaSDKAuthService {
  constructor(){ }

    
  //Configuration
  strRedirectURL = '{{Redirect URL}}';
  strClientID = '{{Client ID}}';
  strIssuer = '{{Issuer URL}}';
  strPostLogoutURL = '{{Post logout URL}}';
  strScope = ['openid', 'email', 'profile'];
  strResponseType = ['token','id_token'];
  strResponseMode = 'fragment';
  strPkce = false;

  
   
    config = {
        clientId: this.strClientID,
        issuer: this.strIssuer,
        redirectUri: this.strRedirectURL,
        postLogoutRedirectUri:this.strRedirectURL,
        responseMode: this.strResponseMode,
        responseType: this.strResponseType,
        scopes: this.strScope,
    };

    OktaSDKAuthClient = new OktaAuth(this.config);    
}
