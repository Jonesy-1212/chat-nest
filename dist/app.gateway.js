"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let AppGateway = class AppGateway {
    constructor() {
        this.logger = new common_1.Logger('ChatGateway');
        this.connectCounts = 0;
        this.allNum = 0;
        this.users = {};
    }
    afterInit() {
        this.logger.log('websocket init ...');
    }
    handleConnection(client) {
        this.connectCounts += 1;
        this.allNum += 1;
        this.users[client.id] = `user-${this.connectCounts}`;
        this.ws.emit('enter', { name: this.users[client.id], allNum: this.allNum, connectCounts: this.connectCounts });
        client.emit('enterName', this.users[client.id]);
    }
    handleDisconnect(client) {
        this.allNum -= 1;
        this.ws.emit('leave', { name: this.users[client.id], allNum: this.allNum, connectCounts: this.connectCounts });
    }
    handleMessage(client, data) {
        this.ws.emit('message', {
            name: this.users[client.id],
            say: data
        });
    }
    handleName(client, data) {
        this.users[client.id] = data;
        client.emit('name', this.users[client.id]);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "ws", void 0);
__decorate([
    websockets_1.SubscribeMessage('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleMessage", null);
__decorate([
    websockets_1.SubscribeMessage('name'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleName", null);
AppGateway = __decorate([
    websockets_1.WebSocketGateway({
        path: '/socket',
        allowEIO3: true,
        cors: {
            origin: /.*/,
            credentials: true
        }
    })
], AppGateway);
exports.AppGateway = AppGateway;
//# sourceMappingURL=app.gateway.js.map