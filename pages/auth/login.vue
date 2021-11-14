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
          <v-card-title class="headline">
            ログイン
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field v-model='user.email' label="メールアドレス" :error-messages="errors.email" />
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
              <!-- <div class="error--text" v-for="(err, index) in errors.non_field_errors" :key="index">
                {{ err }}
              </div> -->
              <v-card-actions>
                <v-row justify="end">
                  <v-btn color="success" @click.prevent="onCognitoAuthenticateUser">ログイン</v-btn>
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
import { AuthenticationDetails, CognitoUserPool, CognitoUser  } from 'amazon-cognito-identity-js'
import AWS from 'aws-sdk'

export default {
  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      errors: {},
      isPasswordHidden: true
    }
  },
  computed: {
    passwordInputType () {
      if (this.isPasswordHidden) {
        return 'password'
      } else {
        return 'text'
      }
    },
    passwordInputTypeIconColor () {
      if (this.isPasswordHidden) {
        return ''
      } else {
        return 'primary'
      }
    }
  },
  methods: {
    switchPasswordInputType () {
      this.isPasswordHidden = !this.isPasswordHidden
    },
    onCognitoAuthenticateUser () {
      const authenticationData = {
        Username: this.user.email,
        Password: this.user.password
      }

      // ユーザープールに送るために整形している
      const authenticationDetails = new AuthenticationDetails(
          authenticationData
      )
      const poolData = {
          // 1つのユーザープールを別々のアプリで使うこともある。
          // アプリをクライアントID指定で判別する
          UserPoolId: process.env.COGNITO_USER_POOL_ID, // ユーザープールID
          ClientId: process.env.COGNITO_CLIENT_ID, // クライアントID
      };
      const userPool = new CognitoUserPool(poolData);
      const userData = {
        Username: this.user.email,
        Pool: userPool
      }

      // 認証処理
      const cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess (result) {
              // 認証完了後の結果確認の例
              const idToken = result.getIdToken().getJwtToken();          // IDトークン
              const accessToken = result.getAccessToken().getJwtToken();  // アクセストークン
              const refreshToken = result.getRefreshToken().getToken();   // 更新トークン

              // 店舗一覧画面にリダイレクトする。
              // アクセストークンを使って店舗一覧を取得する。
              // API叩いて表示する
              console.log("idToken : " + idToken);
              console.log("accessToken : " + accessToken);
              console.log("refreshToken : " + refreshToken);

              // accessTokenにはユーザーの属性値が含まれている。その属性値の参照例
              cognitoUser.getUserAttributes(function(err, result) {
                  if (err) {
                      alert(err.message || JSON.stringify(err));
                      return;
                  }
                  for (let i = 0; i < result.length; i++) {
                      // ユーザーの分類（ex.生産者 or 店舗管理者）や設計によっては所属店舗IDが含まれるため該当キーの値を何らかの形で取得
                      // 情報元に店舗情報を表示する
                      console.log(
                          'attribute ' + result[i].getName() + ' has value ' + result[i].getValue()
                      );
                  }
              });

              // 使うかどうかはわからないよ
              // 以下、認可（認証後のAWSアクセスの権限取得）に関する処理
              AWS.config.region = process.env.COGNITO_REGION

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
              });

              // STSクレデンシャルの保存・更新
              AWS.config.credentials.refresh(error => {
                  if (error) {
                      console.error(error);
                  } else {
                      // この処理が無事完了した後は、IDプールの権限に基づいて、API Gatewayを介さず直接アクセスさせることも可能になる
                      // example: const s3 = new AWS.S3();
                      console.log('Successfully logged!');
                  }
              });

              // IAM認証等、HTTPリクエスト上、アクセスキー・シークレットアクセスキー情報を取り出す処理が生じた場合は以下処理を参考
              // AWS.config.credentials.get(function(){
              //     const accessKeyId = AWS.config.credentials.accessKeyId;
              //     const secretAccessKey = AWS.config.credentials.secretAccessKey;
              //     const sessionToken = AWS.config.credentials.sessionToken;
              // });
          },

          onFailure (err) {
              alert(err.message || JSON.stringify(err))
          },
      });
    }
  }
}
</script>
<style scoped>
</style>
