import { getRepository } from "typeorm";
import { User } from "../../entity/User";

export class LoginController {

    private userRepository = getRepository(User);

    onLogin(io, socket, message) {
        this.userRepository.findOne().then(user => {
            socket.emit('testResp', user)
        })

    }

}