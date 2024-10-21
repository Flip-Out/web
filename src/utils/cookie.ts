export const getIframeCookiesById = (iframeId: string) => {
  return (
    (document.getElementById(iframeId) as HTMLIFrameElement)?.contentDocument
      ?.cookie || ''
  );
};

export const clearIframeCookie = (iframeId: string): void => {
  console.log(document.getElementById(iframeId) as HTMLIFrameElement);

  //   let cookie = (document.getElementById(iframeId) as HTMLIFrameElement)
  //     ?.contentDocument?.cookie;
  //   if (cookie) {
  //     cookie = '';
  //   }
};
