import React, { Component } from 'react';
import {API_PATH} from "../Api";

export default class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.max_chars = 240;
        this.state = {
            chars_left: this.max_chars,
            content_text: ''
        }
    }

    handleContentInput(event) {
        const input = event.target.value;
        this.setState({
            chars_left: this.max_chars - input.length,
            content_text: input
        })
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

    render() {
        return (
            <form onSubmit={this.handleCreateSubmit.bind(this)}>
                <div className="form-group">
                    <label htmlFor="textarea1">Example textarea</label>
                    <textarea onChange={this.handleContentInput.bind(this)} className="form-control" id="textarea1" rows="3" maxLength={this.max_chars}/>
                    <p>Characters Left: {this.state.chars_left}</p>
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        )
    }
}