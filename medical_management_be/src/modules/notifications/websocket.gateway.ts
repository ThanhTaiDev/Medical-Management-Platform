import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { IUserFromToken } from '@/modules/users/types/user.type';
import { UserRole } from '@prisma/client';

interface AuthenticatedSocket extends Socket {
  user?: IUserFromToken;
}

/**
 * WebSocket Gateway cho real-time notifications
 * Xử lý kết nối WebSocket và gửi notifications
 * 
 * @class MedicalManagementGateway
 */
@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/medical-management',
})
export class MedicalManagementGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MedicalManagementGateway.name);
  private readonly connectedUsers = new Map<string, string>(); // userId -> socketId
  private readonly socketToUser = new Map<string, IUserFromToken>(); // socketId -> user

  async handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`🔌 Client connected: ${client.id}`);
    this.logger.log(`🔑 Auth token:`, client.handshake.auth?.token ? 'Present' : 'Missing');
    
    // Authenticate user từ token trong handshake
    try {
      const token = client.handshake.auth?.token;
      if (token) {
        // TODO: Verify JWT token và extract user info
        // const user = await this.authService.verifyToken(token);
        // client.user = user;
        // this.socketToUser.set(client.id, user);
        // this.connectedUsers.set(user.id, client.id);
        // this.logger.log(`User ${user.fullName} connected with socket ${client.id}`);
        
        // Temporary: Allow connection without authentication for testing
        this.logger.log(`⚠️ WebSocket authentication not implemented yet - allowing connection for testing`);
      } else {
        this.logger.log(`❌ No token provided - allowing connection for testing`);
      }
    } catch (error) {
      this.logger.error(`Authentication failed for socket ${client.id}:`, error);
      // Don't disconnect for now - allow testing
      // client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    const user = this.socketToUser.get(client.id);
    if (user) {
      this.connectedUsers.delete(user.id);
      this.socketToUser.delete(client.id);
      this.logger.log(`User ${user.fullName} disconnected`);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { room } = data;
    client.join(room);
    this.logger.log(`Socket ${client.id} joined room: ${room}`);
    
    return {
      event: 'joined-room',
      data: { room, success: true },
    };
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { room } = data;
    client.leave(room);
    this.logger.log(`Socket ${client.id} left room: ${room}`);
    
    return {
      event: 'left-room',
      data: { room, success: true },
    };
  }

  // Gửi notification cho Doctor khi Patient uống thuốc
  notifyDoctorAdherenceUpdate(doctorId: string, patientId: string, status: string) {
    const doctorSocketId = this.connectedUsers.get(doctorId);
    
    this.logger.log(`🔔 Attempting to notify doctor ${doctorId} about patient ${patientId} status: ${status}`);
    this.logger.log(`🔌 Connected users:`, Array.from(this.connectedUsers.keys()));
    this.logger.log(`🎯 Doctor socket ID:`, doctorSocketId);
    
    if (doctorSocketId) {
      this.server.to(doctorSocketId).emit('adherence-updated', {
        patientId,
        status,
        timestamp: new Date().toISOString(),
        message: `Bệnh nhân đã ${status === 'TAKEN' ? 'uống thuốc' : 'bỏ lỡ thuốc'}`,
      });
      
      this.logger.log(`✅ Successfully notified doctor ${doctorId} about patient ${patientId} adherence: ${status}`);
    } else {
      this.logger.log(`❌ Doctor ${doctorId} not connected, cannot send real-time notification`);
      this.logger.log(`📊 Total connected users: ${this.connectedUsers.size}`);
    }
  }

  // Gửi notification cho Patient khi Doctor nhắc nhở
  notifyPatientWarning(patientId: string, doctorId: string, message: string) {
    const patientSocketId = this.connectedUsers.get(patientId);
    
    if (patientSocketId) {
      this.server.to(patientSocketId).emit('doctor-warning', {
        doctorId,
        message,
        timestamp: new Date().toISOString(),
        type: 'LOW_ADHERENCE',
      });
      
      this.logger.log(`Notified patient ${patientId} about warning from doctor ${doctorId}`);
    } else {
      this.logger.log(`Patient ${patientId} not connected, cannot send real-time notification`);
    }
  }

  // Broadcast cho tất cả Doctor về thay đổi adherence
  broadcastAdherenceUpdate(patientId: string, status: string, doctorIds: string[]) {
    doctorIds.forEach(doctorId => {
      const doctorSocketId = this.connectedUsers.get(doctorId);
      if (doctorSocketId) {
        this.server.to(doctorSocketId).emit('adherence-broadcast', {
          patientId,
          status,
          timestamp: new Date().toISOString(),
          message: `Bệnh nhân đã ${status === 'TAKEN' ? 'uống thuốc' : 'bỏ lỡ thuốc'}`,
        });
      }
    });
    
    this.logger.log(`Broadcasted adherence update for patient ${patientId} to ${doctorIds.length} doctors`);
  }

  // Gửi notification cho tất cả Doctor trong room
  notifyDoctorsInRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
    this.logger.log(`Sent ${event} to room ${room}`);
  }

  // Lấy danh sách user đang online
  getConnectedUsers() {
    return Array.from(this.socketToUser.values());
  }

  // Kiểm tra user có online không
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}
