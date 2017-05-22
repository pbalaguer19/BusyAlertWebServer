module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userinfo', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM,
      values: [ 'NEW_USER', 'USER_UNSUBSCRIBED',
                'USER_LOGGED_IN', 'USER_LOGGED_OUT',
                'STATUS_BUSY', 'STATUS_AVAILABLE',
                'FAVOURITE_ADDED', 'FAVOURITE_REMOVED'],
      allowNull: false
    },
    extraData: {
      type: DataTypes.JSON,
      allowNull: false
    }
  });
}
