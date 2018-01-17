export interface IProject {
    tx: String;
    owner: {
        did: String;
        name: String;
        email: String;
    };
    name: String;
    country: String;
}
