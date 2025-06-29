import axios from "axios";
import { useState } from "react";
import { getDecryptedToken } from "./getDecryptedToken";

export default function useUpdateFaq() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const update = async (url: string, data: any, contentType: 'json' | 'form-data' | 'urlencoded' = 'json') => {
  try {
    const token = getDecryptedToken();
    if (!token) return null;

    setLoading(true);

    let headers: any = {
      Authorization: `Bearer ${token}`,
    };
    let body: any = data;

    if (contentType === 'json') {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    } else if (contentType === 'form-data') {
    } else if (contentType === 'urlencoded') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      body = new URLSearchParams(data).toString();
    }

    const res = await axios.put(url, body, { headers });

    if (res.status >= 200 && res.status <= 300) {
      setResponse("تم بنجاح");
    }
  } catch (error: any) {
    console.error("فشل الإرسال:", error);
    setResponse("حدث خطأ أثناء الإرسال");
  } finally {
    setLoading(false);
  }
};

  return { update, response, loading };
}
