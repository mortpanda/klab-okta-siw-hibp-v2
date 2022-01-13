import { Injectable } from '@angular/core';
import { OktaAuth } from "@okta/okta-auth-js";
import {OktaConfigService} from './okta-config.service';

@Injectable({
  providedIn: 'root'
})
export class OktaSDKAuthService {
  constructor(private OktaConfigService:OktaConfigService){ }

    
  //Configuration
  // strRedirectURL = '{{Redirect URL}}';
  // strClientID = '{{Client ID}}';
  // strIssuer = '{{Issuer URL}}';
  // strPostLogoutURL = '{{Post logout URL}}';
  // strScope = ['openid', 'email', 'profile'];
  // strResponseType = ['token','id_token'];
  // strResponseMode = 'fragment';
  // strPkce = false;

  
   
    config = {
        clientId: this.OktaConfigService.strClientID,
        issuer: this.OktaConfigService.strIssuer,
        redirectUri: this.OktaConfigService.strRedirectURL,
        postLogoutRedirectUri:this.OktaConfigService.strPostLogoutURL,
        responseMode: this.OktaConfigService.strResponseMode,
        responseType: this.OktaConfigService.strResponseType,
        scopes: this.OktaConfigService.strScope,
    };

    OktaSDKAuthClient = new OktaAuth(this.config);    
}
