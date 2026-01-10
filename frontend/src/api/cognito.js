import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID,
  ClientId: process.env.REACT_APP_CLIENT_ID
};

const userPool = new CognitoUserPool(poolData);

// 新規登録
export const signUp = (email, password) => {
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, [], null, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// 確認コード検証
export const confirmSignUp = (email, code) => {
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool
  });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// ログイン
export const signIn = (email, password) => {
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool
  });

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err)
    });
  });
};

// ログアウト
export const signOut = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};

// 現在のユーザー取得
export const getCurrentUser = () => {
  return userPool.getCurrentUser();
};

// トークン取得
export const getToken = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      reject(new Error('No user'));
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err) reject(err);
      else resolve(session.getIdToken().getJwtToken());
    });
  });
};