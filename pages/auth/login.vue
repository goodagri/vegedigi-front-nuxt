<template>
  <v-app>
    <v-img
      src="/A_yoko1.svg"
      max-height="60"
      max-width="180"
      class="mt-2 ml-2"
    />
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <div class="logo py-4 d-flex justify-center">
          <AppLogo />
        </div>
        <v-card>
          <v-card-title class="headline">ログイン</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model='user.email'
                label="メールアドレス"
                :error-messages="errors.email"
              />
              <v-text-field
                v-model="user.password"
                label="パスワード"
                :type="passwordInputType"
                :error-messages="errors.password"
              >
                <v-icon
                  slot="append"
                  :color="passwordInputTypeIconColor"
                  @click="switchPasswordInputType"
                >
                  mdi-eye-off
                </v-icon>
              </v-text-field>
              <v-card-actions>
                <v-row justify="end">
                  <v-btn
                    color="success"
                    @click.prevent="signIn"
                  >
                    ログイン
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser,
} from "amazon-cognito-identity-js"
import AWS from "aws-sdk"

export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      errors: {},
      isPasswordHidden: true,
      message: "",
    };
  },
  computed: {
    passwordInputType() {
      if (this.isPasswordHidden) {
        return "password";
      } else {
        return "text";
      }
    },
    passwordInputTypeIconColor() {
      if (this.isPasswordHidden) {
        return "";
      } else {
        return "primary";
      }
    },
  },
  methods: {
    switchPasswordInputType() {
      this.isPasswordHidden = !this.isPasswordHidden;
    },
    onClickAuthUser() {

      this.onCognitoAuthenticateUser()
    },
    onCognitoAuthenticateUser () {
      const authenticationData = {
        Username: this.user.email,
        Password: this.user.password
      }
      const authenticationDetails = new AuthenticationDetails(authenticationData) // UserPoolに送るために整形
      const poolData = {
        // 1つのユーザープールを別々のアプリで使うこともある。アプリをクライアントID指定で判別する
        UserPoolId: process.env.COGNITO_USER_POOL_ID, // ユーザープールID
        ClientId: process.env.COGNITO_CLIENT_ID, // クライアントID
      };
      const userPool = new CognitoUserPool(poolData)
      const userData = {
        Username: this.user.email,

        Pool: userPool
      }
      const cognitoUser = new CognitoUser(userData) // 認証処理

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(result) {
          // 認証完了後の結果確認の例
          const idToken = result.getIdToken().getJwtToken(); // IDトークン
          const accessToken = result.getAccessToken().getJwtToken(); // アクセストークン
          const refreshToken = result.getRefreshToken().getToken(); // 更新トークン
          // 店舗一覧画面にリダイレクトする。アクセストークンを使って店舗一覧を取得する。
          localStorage.setItem("idToken", idToken);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          const userInfoList = [];
          // accessTokenにはユーザーの属性値が含まれている。その属性値の参照例
          cognitoUser.getUserAttributes(function (err, result) {
            if (err) {
              alert(err.message || JSON.stringify(err))
              return;
            }
            for (const r of result) {
              // ユーザーの分類（生産者or店舗管理者）や所属店舗IDが含まれる。該当キーの値を何らかの形で取得
              // 情報元に店舗情報を表示する
              userInfoList.push({
                name: r.getName(),
                value: r.getValue(),
              });
            }
          const data = userInfoList.find(d => d.name === 'sub')
          console.log('userInfoList', userInfoList)
          console.log('data', data)
          const test = data.value
          console.log('test', test)
          });

          // 以下、認可（認証後のAWSアクセスの権限取得）に関する処理。使うかどうかはわからない。
          AWS.config.region = process.env.COGNITO_REGION;

            // IDプールを通じたSTSクレデンシャルの取得
            const UserPoolId = `cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              // 自身の環境のIDプール情報を入力
              IdentityPoolId: process.env.COGNITO_ID_POOL_ID,
              Logins: {
                // 自身の環境のユーザープール情報を入力
                [UserPoolId]: result
                  .getIdToken()
                  .getJwtToken(),
              },
            })
            AWS.config.credentials.refresh(error => {
              if (error) {
                console.error('error',error)
              } else {
                console.log("success")
              }
            });
        },
      })
      this.signIn()
    },
    onFailure (err) {
      alert(err.message || JSON.stringify(err))
    }
  }
}
</script>
<style scoped>
</style>
