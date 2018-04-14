import DropboxTypes, {Dropbox} from "dropbox";
import sinon from "sinon";

DropboxTypes.Dropbox = class DropboxMock extends Dropbox {
    // Stubs for methods we want to be testable:
    static stubFilesSaveUrl = sinon.stub().resolves()
    static stubFilesDeleteBatch = sinon.stub().resolves()

    // Constructor calls super, and then overrides the methods with stubs
    constructor(options) {
        super(options)
        this.filesSaveUrl = DropboxMock.stubFilesSaveUrl
        this.filesDeleteBatch = DropboxMock.stubFilesDeleteBatch
    }
}

// Dropbox module exports 'DropboxTypes'. We export our augmented version instead:
module.exports = DropboxTypes