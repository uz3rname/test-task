export class BookingException extends Error {}

export class NonexistentRoomException extends BookingException {
  constructor(roomId: number) {
    super();
    this.message = `Room ${roomId} does not exist`;
  }
}

export class InvalidPeriodException extends BookingException {
  constructor() {
    super();
    this.message = 'Booking period is invalid';
  }
}

export class InvalidCheckInDayException extends BookingException {
  constructor(days: string) {
    super();
    this.message = `Can't check in at ${days}`;
  }
}

export class InvalidCheckOutDayException extends BookingException {
  constructor(days: string) {
    super();
    this.message = `Can't check out at ${days}`;
  }
}

export class RoomIsUnavailableException extends BookingException {
  constructor() {
    super();
    this.message = 'This room is already booked for requested period';
  }
}
