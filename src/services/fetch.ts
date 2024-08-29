import Cookies from "js-cookie";
import { prepareURLEncodedParams } from "./prepareUrlEncodedParams";
import { makeStore } from "../Redux";
import { removeUserDetails } from "../Redux/Modules/Auth";
interface IAPIResponse {
  success: boolean;
  status: number;
  data: any;
}
class FetchService {
  authStatusCodes: number[] = [401, 403];
  authErrorURLs: string[] = ["/signin"];

  responseOnlyURLs: string[] = ["preview"];
  private _isGlobal: Boolean;
  constructor(isGlobal = false) {
    let store = makeStore(false);
    this._isGlobal = isGlobal;
    store.subscribe(() => {});
  }

  responseOnlyUrlOrNot(url: string) {
    return this.responseOnlyURLs.some((arrayUrl: string) =>
      url.includes(arrayUrl)
    );
  }
  configureAuthorization(config: any) {
    let store = makeStore(false);
    const state = store.getState();
    const accessToken = state?.auth?.user?.access_token;
    config.headers["Authorization"] = accessToken;
  }
  setDefualtHeaders(config: any) {
    config.headers = {
      "Content-Type": "application/json",
    };
  }

  setHeader(config: any) {
    config.headers = {};
  }

  dispatchRemoveUserDetails() {
    let store = makeStore(false);
    store.dispatch(removeUserDetails());
  }
  checkToLogOutOrNot(path: string) {
    return this.authErrorURLs.some((arrayUrl: string) =>
      path.includes(arrayUrl)
    );
  }
  isAuthRequest(path: string) {
    return this.authErrorURLs.includes(path);
  }

  async hit(...args: any): Promise<IAPIResponse> {
    let [path, config, headersOrNot = true] = args;

    this.setDefualtHeaders(config);
    if (!headersOrNot) {
      this.setHeader(config);
    }
    const authReq = this.isAuthRequest(path);
    if (!authReq) {
      this.configureAuthorization(config);
    }
    // request interceptor starts
    let url = import.meta.env.VITE_TEST_VAR + path;

    const response: any = await fetch(url, config);

    if (response?.status == 200 || response?.status == 201) {
      if (this.responseOnlyUrlOrNot(url)) {
        return {
          success: true,
          status: response.status,
          data: response,
        };
      } else {
        return {
          success: true,
          status: response.status,
          data: { ...(await response.json()), status: response.status },
        };
      }
    } else if (
      this.authStatusCodes.includes(response.status) &&
      !this.checkToLogOutOrNot(path)
    ) {
      this.dispatchRemoveUserDetails();
      Cookies.remove("user");
      window.location.href = "/";
      return {
        success: false,
        status: response.status,
        data: { ...(await response.json()), status: response.status },
      };
    } else {
      let responseData = await response.json();

      return {
        status: response?.status,
        success: false,
        data: { status: response?.status, ...responseData },
      };
    }
  }
  async post(url: string, payload = {}) {
    return await this.hit(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async postWithoutPayload(url: string) {
    return await this.hit(url, { method: "POST" });
  }

  async postFormData(url: string, payload = {}) {
    return await this.hit(
      url,
      {
        method: "POST",
        body: payload,
      },
      false
    );
  }

  async get(url: string, queryParams = {}) {
    if (Object.keys(queryParams).length > 0) {
      url = prepareURLEncodedParams(url, queryParams);
    }
    return await this.hit(url, {
      method: "GET",
    });
  }
  async delete(url: string, payload = {}) {
    return this.hit(url, {
      method: "DELETE",
      body: JSON.stringify(payload),
    });
  }
  async put(url: string, payload = {}) {
    return this.hit(url, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
  async patch(url: string, payload = {}) {
    return this.hit(url, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }
}
// for app search
export const $fetch = new FetchService();
export const $globalFetch = new FetchService(true);
