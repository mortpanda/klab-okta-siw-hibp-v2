import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { OktaAuth } from "@okta/okta-auth-js";
import { BehaviorSubject } from "rxjs";
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { OktaConfigService } from './okta-config.service';



//Github upload
// var strRedirectUrl = "{{Redirect URL}}";
// var strPostLogoutUrl = "{{Post logout URL}}";
// var strClientID = "{{Client ID}}";
// var strIssuer = "{{Issuer URL}}";
// var strBaseURL = "{{Base URL}}";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public isAuthenticated = new BehaviorSubject<boolean>(false);
  public strstateToken;
  public oktaSignIn;
  public idToken;

  strRedirectUrl = this.OktaConfigService.strRedirectURL;
  strPostLogoutUrl = this.OktaConfigService.strPostLogoutURL;
  strClientID = this.OktaConfigService.strClientID;
  strIssuer = this.OktaConfigService.strIssuer;
  strBaseURL = this.OktaConfigService.strBaseURI;

  private authClient = new OktaAuth({
    issuer: this.strIssuer,
    clientId: this.strClientID,
  });

  constructor(private router: Router, private OktaConfigService: OktaConfigService) { }

  async checkAuthenticated() {
    const authenticated = await this.authClient.session.exists();
    this.isAuthenticated.next(authenticated);
    return authenticated;
  }

  async login(username: string, password: string) {

    const transaction = await this.authClient.signIn({ username, password });

    var element = document.getElementById("loginpage");
    element.parentNode.removeChild(element);


    this.strstateToken = transaction.data.stateToken;

    //Uses the state token to perform MFA authentication using a newly created widget
    var oktaSignIn = new OktaSignIn({
      clientId: this.strClientID,
      baseUrl: this.strBaseURL,
      language: 'en',
      redirectUri: this.strRedirectUrl,
      colors: {
        brand: this.OktaConfigService.strBrand,
      },
      stateToken: this.strstateToken,
      postLogoutRedirectUri: this.strPostLogoutUrl,
      authParams: {
        issuer: this.strIssuer,
        responseMode: this.OktaConfigService.strResponseMode,
        responseType: this.OktaConfigService.strResponseType,
        scopes: this.OktaConfigService.strScope,
        pkce: this.OktaConfigService.strPkce,

      },
    });

    oktaSignIn.authClient.token.getUserInfo().then(function (user) {
      console.log("Hello, " + user.email + "! You are *still* logged in! :)");
      //document.getElementById("logout").style.display = 'block';
    }, function (error) {
      oktaSignIn.showSignInToGetTokens({
        el: '#okta-widget-container'
      }).then(function (tokens) {
        oktaSignIn.authClient.tokenManager.setTokens(tokens);
        oktaSignIn.remove();

        const idToken = tokens.idToken;
        const accessToken = tokens.accessToken;
        console.log("Hello, " + idToken.claims.email + "! You just logged in! :)");
        console.log(idToken);
        console.log(accessToken);


        return oktaSignIn.authClient.token.getUserInfo(accessToken, idToken)
          .then(function (user) {
            // user has details about the user
            console.log(JSON.stringify(user));
            window.location.replace(this.OktaConfigService.strRedirectUrl);
          })
          .catch(function (err) {
            // handle OAuthError or AuthSdkError (AuthSdkError will be thrown if app is in OAuthCallback state)
          });

      }).catch(function (err) {
        console.error(err);
      });
    });
  }

  OktaLogout(bar?: string) {
    this.authClient.tokenManager.clear();
    this.authClient.signOut({ postLogoutRedirectUri: this.OktaConfigService.strPostLogoutURL, idToken: this.idToken });
    location.reload();
  }

}
