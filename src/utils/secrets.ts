const getSecrets = () => {
  const secrets: any = {
    MONGODB_URI: process.env.MONGODB_URI,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    PUBLIC_KEY: process.env.PUBLIC_KEY
  }

  for(let key in secrets) {
    if(Object.prototype.hasOwnProperty.call(secrets, key)) {
      if(!secrets[key]) {
        console.log(`Missing secret. Provide value for ${key}.`);
        process.exit(1);
      }
    }
  }

  return secrets;
}

export default getSecrets();
