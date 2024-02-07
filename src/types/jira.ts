// type JiraRefreshToken struct {
// 	UID          uuid.UUID `json:"id" gorm:"primary_key;"`
// 	CreatedAt    time.Time
// 	UpdatedAt    time.Time
// 	DeletedAt    gorm.DeletedAt `gorm:"index"`
// 	UserID       string         `json:"user_id"`
// 	RefreshToken string         `gorm:"type:text" json:"refreshToken"`
// }

export type JiraRefreshToken = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  userID: string;
  refreshToken: string;
};
