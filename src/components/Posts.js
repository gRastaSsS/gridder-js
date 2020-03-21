import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import Timestamp from 'react-timestamp';
import {API_PATH} from "../Api";

export default class Posts extends Component {
    constructor(props) {
        super(props);
        this.max_chars = 240;
        this.state = {
            posts: [],
            search_query: '',
            current_page: 1,
            page_size: 10,
            total: 0,
            chars_left: this.max_chars,
            content_text: ''
        }
    }

    updatePosts() {
        fetch(API_PATH + '/posts/search', {
            method: 'POST',
            body: JSON.stringify({
                page : this.state.current_page - 1,
                size : this.state.page_size,
                query : this.state.search_query
            }),
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type' : 'application/json'
            }
        }).then(results => {
            return results.json()
        })
            .then(data => {
                const posts = data.content.map((post) => {
                    return (
                        <div key={post.id}>
                            <div className="card">
                                <div className="card-header">{post.author} <Timestamp relative date={post.updatedAt / 1000}/></div>
                                <div className="card-body">
                                    <p className="card-text">{post.content}</p>
                                </div>
                            </div>
                            <br/>
                        </div>
                    )
                });

                const total = data.totalElements;

                this.setState({
                    posts: posts,
                    total: total
                });
            })
    }

    handleContentInput(event) {
        const input = event.target.value;
        this.setState({
            chars_left: this.max_chars - input.length,
            content_text: input
        })
    }

    handleSearchInput(event) {
        const input = event.target.value;
        this.setState({
            search_query: input
        })
    }

    handleSearchSubmit(event) {
        event.preventDefault();
        this.updatePosts();
    }

    handleCreateSubmit(event) {
        //event.preventDefault();
        const regexp = /#[A-Za-z0-9]*/g;
        const tags = this.state.content_text.match(regexp).map(tag => tag.substring(1));
        fetch(API_PATH + '/posts', {
            method: 'POST',
            body: JSON.stringify({
                content: this.state.content_text,
                tags: tags,
                topicCreator: true
            }),
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type' : 'application/json'
            }
        }).then()
    }

    handlePageChange(pageNumber) {
        this.setState({ current_page: pageNumber });
        this.updatePosts();
    }

    componentDidMount() {
        this.updatePosts();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <form onSubmit={this.handleCreateSubmit.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="textarea1">Write your post here. Mark tags with # symbol</label>
                                <textarea onChange={this.handleContentInput.bind(this)} className="form-control" id="textarea1" rows="3" maxLength={this.max_chars}/>
                                <p>Characters Left: {this.state.chars_left}</p>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <form onSubmit={this.handleSearchSubmit.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="search">Search posts here</label>
                                <input onChange={this.handleSearchInput.bind(this)} type="text" className="form-control" id="search" placeholder="Query"/>
                                <br/>
                                <span className="form-text text-muted">[word0 word1] to search by any word</span>
                                <span className="form-text text-muted">(word0 word1) to search by all words</span>
                                <span className="form-text text-muted">{'{'}word0 word1{'}'} to search by tags</span>
                                <span className="form-text text-muted">"word0 word1" to search by phrase</span>
                                <br/>
                                <button type="submit" className="btn btn-primary">Search</button>
                            </div>
                        </form>
                    </div>
                </div>

                <hr/>
                <br/>
                <div className="row">
                    <div className="col-md-12">{this.state.posts}</div>
                    <div className="col-md-12">
                        <Pagination
                            activePage={this.state.current_page}
                            itemsCountPerPage={this.state.page_size}
                            totalItemsCount={this.state.total}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange.bind(this)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}