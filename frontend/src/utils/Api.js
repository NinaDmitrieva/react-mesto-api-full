
export default class Api {
    constructor({baseUrl, headers}) {
        this.baseUrl = baseUrl;
        this.headers = headers;
    }

    requestResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Все сломалось:( ${res.status}`);
    }

    getHeaders() {
        const token = localStorage.getItem('jwt');
        return {
            'Authorization': `Bearer ${token}`,
            ...this.headers,
        };
    }

    getInitialCards() {
        return fetch(`${this.baseUrl}/cards`, {
            method: 'GET',
            headers: this.getHeaders(),
        })
            .then(this.requestResponse)
    }
   
 
    addNewCard(name, link) { 
        return fetch(`${this.baseUrl}/cards`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                name: name,
                link: link
            })
        })
            .then(this.requestResponse)
    }

    getUserInfo() {
        return fetch(`${this.baseUrl}/users/me`, {
            method: 'GET',
            headers: this.getHeaders(),
        })
            .then(this.requestResponse);
    }

    setUserInfo(name, job) {
        return fetch(`${this.baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify({
                name: name,
                about: job
            })
        })
            .then(this.requestResponse)
    }

    setAvatarInfo(data) {
        return fetch(`${this.baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify({
                avatar: data.avatar
            })          
        })
            .then(this.requestResponse)
    }

    deleteCard(id) { 
        return fetch(`${this.baseUrl}/cards/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        })
            .then(this.requestResponse)
    }

    // setLike(id) {
    //     return fetch(`${this.baseUrl}/cards/${id}/likes`, {
    //       method: "PUT",
    //       headers: this.headers,
    //     })
    //         .then(this.requestResponse)
    //   }
    
    // deleteLike(id) {
    //     return fetch(`${this.baseUrl}/cards/${id}/likes`, {
    //       method: "DELETE",
    //       headers: this.headers,
    //     })
    //         .then(this.requestResponse)
    //   }
      changeLike(id, isLiked) {
        return fetch(`${this.baseUrl}/cards/${id}/likes`, {
          method: `${isLiked ? 'PUT' : 'DELETE'}`,
            headers: this.getHeaders(),
        })
            .then(this.requestResponse);
      }
}

// export const api = new Api('https://api.mesto-full.nomoredomains.sbs', {
//     authorization: '1fed1f0c-d99b-4c82-a201-fb2e7265dac6',
//     'Content-Type': 'application/json',
//     'Accept': 'application/json: charset=utf-8'
//   });

export const api = new Api({
    baseUrl: "https://api.mesto-full.nomoredomains.sbs",
    headers: {
        "Content-Type": "application/json",
    },
});

