class Player {
    name: string = $state('');

    get() {
        return this.name;
    }

    set(newName: string) {
        this.name = newName;
    }
}

export const player = new Player();
