// not using this anymore
// checking to see global state management using runes and classes

class Player {
    name: string = $state('');
    is_creator: boolean = $state(false);

    get() {
        return this.name;
    }

    set(newName: string) {
        this.name = newName;
    }

    isCreator() {
        this.is_creator = true;
    }

    notCreator() {
        this.is_creator = false;
    }

    creator() {
        return this.is_creator;
    }
}

export const player = new Player();
